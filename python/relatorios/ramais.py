from reportlab.pdfgen import canvas
from datetime import datetime
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
import os

from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

def gerar_relatorio_pdf(dados, UPLOAD_FOLDER):
    nome_arquivo = os.path.join(UPLOAD_FOLDER, "relatorio_produtos.pdf")
    c = canvas.Canvas(nome_arquivo, pagesize=A4)
    largura, altura = A4

    # Cabeçalho
    c.setFont("Helvetica-Bold", 16)
    c.drawString(2 * cm, altura - 2 * cm, "Relatório de Usuários")

    c.setFont("Helvetica", 10)
    c.drawString(2 * cm, altura - 2.7 * cm, f"Gerado em: {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}")

    # Tabela
    y = altura - 4 * cm
    c.setFont("Helvetica-Bold", 10)
    c.drawString(2 * cm, y, "Nome")
    c.drawString(11 * cm, y, "Login")
    c.drawString(15 * cm, y, "Cargo")

    c.setFont("Helvetica", 10)
    y -= 0.7 * cm

    for item in dados:
        if y < 2 * cm:
            c.showPage()
            y = altura - 2 * cm
        c.drawString(2 * cm, y, str(item["nome"]))
        c.drawString(11 * cm, y, str(item["login"]))
        c.drawString(15 * cm, y, str(item["cargo"]))
        y -= 0.6 * cm
    
    c.save()
    return nome_arquivo

def gerar_pdf_com_tabela(dados, caminho_saida):
    doc = SimpleDocTemplate(caminho_saida, pagesize=A4, leftMargin=1.5 * cm, rightMargin=1.5 * cm, topMargin=1.5 * cm, bottomMargin=1.5 * cm)
    elementos = []
    estilos = getSampleStyleSheet()

    # Título
    # elementos.append(Paragraph("Relatório de Usuários", estilos['Title']))
    # elementos.append(Spacer(1,12))

    estilo_titulo = ParagraphStyle(
        name="TituloTabela",
        fontName="Helvetica-Bold",
        fontSize=9,
        alignment=1,  # 0=left, 1=center, 2=right
        spaceAfter=6
    )

    # Cabeçalho + dados
    titulo = Paragraph("SECRETARIA DE ASSISTÊNCIA SOCIAL - (18) 3636-1260", estilo_titulo)
    # subtitulo = Paragraph("RUA BANDEIRANTES, 111, CENTRO - CEP: 16010-090", estilo_titulo)
    rodape1 = Paragraph("TRANSFERÊNCIA DE RAMAL: *2 + RAMAL", estilo_titulo)
    rodape2 = Paragraph("RETORNO DE LIGAÇÃO: ** + RAMAL", estilo_titulo)
    dados_tabela = [
        [titulo],
        # [subtitulo],
        ["NOME", "DEPTO.", "RAMAL"],
        *[[str(d["nome"]).upper(), str(d["setor"]).upper(), d["numero"]] for d in dados],
        [rodape1],
        [rodape2]
    ]

    # Tabela
    tabela = Table(dados_tabela, colWidths=[3 * cm, 4 * cm, 2 * cm])
    tabela.setStyle(TableStyle([
        ("SPAN", (0,0), (-1,0)),
        # ("SPAN", (0,1), (-1,1)),
        ("SPAN", (0,-1), (-1,-1)),
        ("SPAN", (0,-2), (-1,-2)),
        ("BACKGROUND", (0,0), (-1,0), colors.white),
        ("TEXTCOLOR", (0,0), (-1,0), colors.black),
        ("ALIGN", (0,0), (-1,-1), "LEFT"),
        ("GRID", (0,0), (-1,-1), 0.5, colors.black),
        ("FONTNAME", (0, 0), (-1, 1), "Helvetica-Bold"),
        ("FONTSIZE", (0, 1), (-1, -1), 9),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
        ("BACKGROUND", (0, 1), (-1, -1), colors.white),
    ]))

    tabela_lado_a_lado = Table([[tabela, tabela]], colWidths=[10 * cm, 10 * cm])

    elementos.append(tabela_lado_a_lado)

    # Geração do PDF
    doc.build(elementos)
    return caminho_saida
