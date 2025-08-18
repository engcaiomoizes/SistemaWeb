from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import FileResponse, PlainTextResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os, zipfile, shutil
from PyPDF2 import PdfMerger, PdfReader, PdfWriter
import fitz
import uuid
import cairosvg
from pydantic import BaseModel

# Dependências relatório MySQL
from db.mysql import get_connection
from relatorios.usuarios import gerar_pdf_com_tabela as relatorio_usuarios
from relatorios.impressoras import gerar_pdf_com_tabela as relatorio_impressoras
from relatorios.ramais import gerar_pdf_com_tabela as gerar_folha_ramal
from relatorios.folha_ponto import gerar_folhas
import aiofiles

from relatorios.patrimonios import gerar_relatorio as relatorio_patrimonios
from relatorios.locais import gerar_relatorio as relatorio_locais

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
def gerar_relatorio_impressoras():
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

class RequestBodyPatrimonios(BaseModel):
    tipos: list[int]
    locais: list[int]

# --- Rota 6: Gerar relatório de Patrimônios ---
@app.post("/relatorio-patrimonios")
def gerar_relatorio_patrimonios(request: RequestBodyPatrimonios):
    tipos = request.tipos
    locais = request.locais

    where_clauses = []
    parametros = []

    if tipos:
        tipos_placeholders = ', '.join(['%s'] * len(tipos))
        where_clauses.append(f"t.id IN ({tipos_placeholders})")
        parametros.extend(tipos)
    
    if locais:
        locais_placeholders = ', '.join(['%s'] * len(locais))
        where_clauses.append(f"l.id IN ({locais_placeholders})")
        parametros.extend(locais)
    
    where_clause = " AND ".join(where_clauses) if where_clauses else "1=1"
    
    try:
        with get_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(f"SELECT CONCAT(IFNULL(p.num_patrimonio, ''), ' ', IFNULL(p.orgao_patrimonio, '')) AS patrimonio, t.nome AS tipo_nome, p.descricao, l.nome AS nome_local, l.apelido FROM Patrimonios p INNER JOIN Tipos t ON t.id = p.tipo INNER JOIN Locais l ON l.id = p.local WHERE {where_clause}", parametros)
                dados = cursor.fetchall()
    except Exception as e:
        return {"erro": f"Erro ao consultar MySQL: {str(e)}"}
    
    # pdf_path = gerar_tabela(dados_novos, UPLOAD_FOLDER)
    pdf_path = relatorio_patrimonios(dados, os.path.join(UPLOAD_FOLDER, "relatorio_patrimonios.pdf"))
    return FileResponse(pdf_path, filename="relatorio_patrimonios.pdf", media_type="application/pdf")

@app.get("/relatorio-locais")
def gerar_relatorio_locais():
    try:
        with get_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute("SELECT nome, apelido, endereco, telefone_1, email_1, faixa_ip, ativo FROM Locais ORDER BY ativo DESC, nome ASC")
                dados = cursor.fetchall()
    except Exception as e:
        return { "erro": f"Erro ao consultar MySQL: {str(e)}" }
    
    pdf_path = relatorio_locais(dados, os.path.join(UPLOAD_FOLDER, "relatorio_locais.pdf"))
    return FileResponse(pdf_path, filename="relatorio_locais.pdf", media_type="application/pdf")

@app.get("/folha-ramal")
def folha_ramal(local: int):
    try:
        with get_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute('SELECT nome, apelido, telefone_1 FROM Locais WHERE id = %s', local)
                local_info = cursor.fetchone()
                cursor.execute(f'SELECT numero, nome, setor FROM Ramais WHERE localId = {local} ORDER BY nome = "Expediente" DESC, setor LIKE "%Secretária%" DESC, setor LIKE "%Gabinete%" DESC, setor LIKE "%Assessor" DESC, setor LIKE "%Ouvidoria%" DESC, setor LIKE "%Gestão%" DESC, setor LIKE "%RH%" DESC, setor LIKE "%SUAS%" DESC, setor LIKE "%Pol. Públicas%" DESC, setor LIKE "%COMAS%" DESC, setor LIKE "%P. Especial%" DESC, setor LIKE "%P. Básica%" DESC, setor LIKE "%Cad. Único%" DESC, setor LIKE "%Viva Leite%" DESC, setor LIKE "%TI%" DESC, numero ASC')
                dados = cursor.fetchall()
    except Exception as e:
        return { "erro": f"Erro ao consultar MySQL: {str(e)}" }
    
    pdf_path = gerar_folha_ramal(local_info, dados, os.path.join(UPLOAD_FOLDER, "folha_ramal.pdf"))
    return FileResponse(pdf_path, filename="folha_ramal.pdf", media_type="application/pdf")

class RequestBody(BaseModel):
    ano: int
    mes: int
    funcionarios: list[str]
    dias_abertos: list[int]

@app.post("/folhas-ponto")
def folhas_ponto(request: RequestBody):
    ano = request.ano
    mes = request.mes
    funcionarios = request.funcionarios
    dias_abertos = request.dias_abertos

    placeholders = ', '.join(['%s'] * len(funcionarios))
    try:
        with get_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(f"SELECT f.nome, f.matricula, f.cargo, l.nome AS local_nome, l.apelido, f.rg FROM Funcionarios f LEFT JOIN Locais l ON l.id = f.local WHERE f.id IN ({placeholders})", funcionarios)
                dados = cursor.fetchall()
                cursor.execute("SELECT data, descricao FROM Feriados")
                feriados = cursor.fetchall()
    except Exception as e:
        return { "erro": f"Erro ao consultar MySQL: {str(e)}" }
    
    pdf_path = gerar_folhas(ano=ano, mes=mes, dados=dados, holidays=feriados, dias_abertos=dias_abertos, caminho_saida=os.path.join(UPLOAD_FOLDER, f"FOLHAS - {mes:02d}-{ano}.pdf"))
    return FileResponse(pdf_path, filename=f"FOLHAS - {mes:02d}-{ano}.pdf", media_type="application/pdf")

@app.post("/svg-to-png")
def svg_to_png(caminho_svg, caminho_png):
    cairosvg.svg2png(url=caminho_svg, write_to=caminho_png)

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
