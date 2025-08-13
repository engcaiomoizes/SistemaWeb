from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import FileResponse, PlainTextResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os, zipfile, shutil
from PyPDF2 import PdfMerger, PdfReader, PdfWriter
import fitz
import uuid

# Dependências relatório MySQL
from db.mysql import get_connection
from relatorios.usuarios import gerar_pdf_com_tabela as relatorio_usuarios
from relatorios.impressoras import gerar_pdf_com_tabela as relatorio_impressoras
from relatorios.ramais import gerar_pdf_com_tabela as gerar_folha_ramal
from relatorios.folha_ponto import gerar_folha_ponto
from relatorios.folha_ponto import gerar_pdf_com_tabela as tabela_folha
import aiofiles

app = FastAPI()

# Permitir requisições do frontend (ajuste para segurança depois)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pastas
UPLOAD_FOLDER = "/app/shared"
OUTPUT_FOLDER = os.path.join(UPLOAD_FOLDER, "output")

TEMP_DIR = os.path.join(UPLOAD_FOLDER, "temp")

app.mount("/static", StaticFiles(directory=TEMP_DIR), name="static")

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)
os.makedirs(TEMP_DIR, exist_ok=True)

# --- Rota 1: Juntar PDFs ---
@app.post("/merge-pdf")
async def merge_pdf(files: list[UploadFile] = File(...)):
    merger = PdfMerger()
    temp_files = []

    for file in files:
        contents = await file.read()
        path = os.path.join(UPLOAD_FOLDER, file.filename)
        with open(path, "wb") as f:
            f.write(contents)
        merger.append(path)
        temp_files.append(path)
    
    output_path = os.path.join(UPLOAD_FOLDER, "merged_output.pdf")
    merger.write(output_path)
    merger.close()

    # Limpa os arquivos temporários, se quiser
    for f in temp_files:
        os.remove(f)
    
    return FileResponse(output_path, media_type="application/pdf", filename="merged_output.pdf")

# --- Rota 2: Separar PDF em páginas e zipar ---
@app.post("/split-pdf")
async def split_pdf(file: UploadFile = File(...)):
    input_path = os.path.join(UPLOAD_FOLDER, file.filename)

    # Salva o PDF original
    with open(input_path, "wb") as f:
        f.write(await file.read())
    
    reader = PdfReader(input_path)
    page_files = []

    for i, page in enumerate(reader.pages):
        writer = PdfWriter()
        writer.add_page(page)
        
        page_path = os.path.join(OUTPUT_FOLDER, f"page_{i + 1}.pdf")
        with open(page_path, "wb") as f:
            writer.write(f)
        page_files.append(page_path)
    
    # Compacta em ZIP
    zip_path = os.path.join(UPLOAD_FOLDER, "output.zip")
    with zipfile.ZipFile(zip_path, "w") as zipf:
        for file_path in page_files:
            zipf.write(file_path, arcname=os.path.basename(file_path))
    
    # Limpar arquivos temporários
    os.remove(input_path)
    shutil.rmtree(OUTPUT_FOLDER)
    os.makedirs(OUTPUT_FOLDER)

    return FileResponse(zip_path, filename="pdf_separado.zip", media_type="application/zip")

# --- Rota 3: Proteger PDF com senha ---
@app.post("/protect-pdf")
async def protect_pdf(file: UploadFile = File(...), password: str = Form(...)):
    input_path = os.path.join(UPLOAD_FOLDER, file.filename)

    # Salvar PDF original
    with open(input_path, "wb") as f:
        f.write(await file.read())
    
    # Abrir e proteger
    reader = PdfReader(input_path)
    writer = PdfWriter()

    for page in reader.pages:
        writer.add_page(page)
    
    writer.encrypt(user_password=password)

    protected_path = os.path.join(UPLOAD_FOLDER, "protected_output.pdf")
    with open(protected_path, "wb") as f:
        writer.write(f)
    
    os.remove(input_path)

    return FileResponse(protected_path, filename="pdf_protegido.pdf", media_type="application/pdf")

# --- Rota 4: Gerar relatório PDF ---
@app.get("/relatorio-usuarios")
def gerar_relatorio_usuarios():
    try:
        with get_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute("SELECT id, nome, login, cargo FROM Usuarios")
                dados = cursor.fetchall()
    except Exception as e:
        return {"erro": f"Erro ao consultar MySQL: {str(e)}"}
    
    # pdf_path = gerar_tabela(dados_novos, UPLOAD_FOLDER)
    pdf_path = relatorio_usuarios(dados, os.path.join(UPLOAD_FOLDER, "relatorio_usuarios.pdf"))
    return FileResponse(pdf_path, filename="relatorio_usuarios.pdf", media_type="application/pdf")

# --- Rota 5: Gerar relatório de Impressoras ---
@app.get("/relatorio-impressoras")
def gerar_relatorio_usuarios():
    try:
        with get_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute("SELECT i.marca, i.modelo, l.nome, l.apelido, i.ip_addr FROM Impressoras i INNER JOIN Locais l ON l.id = i.localId")
                dados = cursor.fetchall()
    except Exception as e:
        return {"erro": f"Erro ao consultar MySQL: {str(e)}"}
    
    # pdf_path = gerar_tabela(dados_novos, UPLOAD_FOLDER)
    pdf_path = relatorio_impressoras(dados, os.path.join(UPLOAD_FOLDER, "relatorio_impressoras.pdf"))
    return FileResponse(pdf_path, filename="relatorio_impressoras.pdf", media_type="application/pdf")

@app.get("/folha-ramal")
def folha_ramal():
    try:
        with get_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute('SELECT numero, nome, setor FROM Ramais ORDER BY nome = "Expediente" DESC, setor LIKE "%Secretária%" DESC, setor LIKE "%Gabinete%" DESC, setor LIKE "%Assessor" DESC, setor LIKE "%Ouvidoria%" DESC, setor LIKE "%Gestão%" DESC, setor LIKE "%RH%" DESC, setor LIKE "%SUAS%" DESC, setor LIKE "%Pol. Públicas%" DESC, setor LIKE "%COMAS%" DESC, setor LIKE "%P. Especial%" DESC, setor LIKE "%P. Básica%" DESC, setor LIKE "%Cad. Único%" DESC, setor LIKE "%Viva Leite%" DESC, setor LIKE "%TI%" DESC, numero ASC')
                dados = cursor.fetchall()
    except Exception as e:
        return { "erro": f"Erro ao consultar MySQL: {str(e)}" }
    
    pdf_path = gerar_folha_ramal(dados, os.path.join(UPLOAD_FOLDER, "folha_ramal.pdf"))
    return FileResponse(pdf_path, filename="folha_ramal.pdf", media_type="application/pdf")

dados_funcionarios = {
    "nome": "CAIO MOIZÉS SANTOS",
    "matricula": "19120",
    "cargo": "AUXILIAR DE CPD",
    "sede": "SMAS",
    "rg": "55.832.638-9"
}

@app.get("/folha-ponto")
def folha_ponto():
    # pdf_path = tabela_folha(dados_funcionario=dados_funcionarios, ano=2025, mes=7, path_destino=UPLOAD_FOLDER)
    pdf_path = tabela_folha(ano=2025, mes=7, caminho_saida=os.path.join(UPLOAD_FOLDER, "folha_ponto.pdf"))
    return FileResponse(pdf_path, filename="folha_ponto.pdf", media_type="application/pdf")

@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    try:
        file_id = str(uuid.uuid4())
        pdf_path = f"{TEMP_DIR}/{file_id}.pdf"
        os.makedirs(TEMP_DIR, exist_ok=True)

        with open(pdf_path, "wb") as f:
            # shutil.copyfileobj(file.file, f)
            while chunk := await file.read(1024):
                f.write(chunk)

        # Gera imagens por página
        doc = fitz.open(pdf_path)
        image_paths = []
        for page_number in range(len(doc)):
            pix = doc[page_number].get_pixmap()
            img_path = f"{TEMP_DIR}/{file_id}_page_{page_number}.png"
            pix.save(img_path)
            image_paths.append(img_path)
        
        return JSONResponse(content={"id": file_id, "pages": image_paths, "message": "File uploaded successfully"})
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)


@app.post("/reorder/")
def reorder_pages(file_id: str = Form(...), order: str = Form(...)):
    order = [int(i) for i in order.split(",")]
    pdf_path = f"{TEMP_DIR}/{file_id}.pdf"
    output_path = f"{TEMP_DIR}/{file_id}_reordered.pdf"

    reader = PdfReader(pdf_path)
    writer = PdfWriter()

    for idx in order:
        writer.add_page(reader.pages[idx])

    with open(output_path, "wb") as f:
        writer.write(f)

    return FileResponse(output_path, filename="reordenado.pdf")

@app.post('/teste')
async def teste(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    with open(file_path, "wb") as f:
        content = await file.read()
        f.write(content)
    return JSONResponse({ "status": "received", "filename": file.filename })
