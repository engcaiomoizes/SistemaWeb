from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.lib.utils import ImageReader
from svglib.svglib import svg2rlg
from reportlab.graphics import renderPDF
from datetime import datetime, date, timedelta
import calendar
import os
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
import re
from bs4 import BeautifulSoup

def split_text_by_br(text):
    # text = re.sub(r'<br\s*/?>', '\n', text)
    # return text.split('\n')
    soup = BeautifulSoup(text, 'html.parser')
    return [str(p) for p in soup.find_all('p')]

def gerar_laudo(dados, texto, caminho_saida):
    doc = SimpleDocTemplate(caminho_saida, pagesize=A4, topMargin=3.5*cm, bottomMargin=1*cm, leftMargin=2*cm, rightMargin=2*cm)
    elementos = []
    estilos = getSampleStyleSheet()

    title_style = ParagraphStyle(
        name="Title",
        fontName="Helvetica-Bold",
        fontSize=12,
        leading=18,
        alignment=1
    )

    text_style = ParagraphStyle(
        name="Text",
        fontName="Helvetica",
        fontSize=12,
        alignment=4,
        leading=18,
        firstLineIndent=1*cm
    )

    def cabecalho_rodape(canvas, doc):
        largura, altura = A4

        # Caminho para os arquivos SVG do cabeçalho e rodapé
        caminho_cabecalho = "/app/img/header.svg"  # Caminho para o SVG do cabeçalho
        caminho_rodape = "/app/img/footer.svg"    # Caminho para o SVG do rodapé

        # Verifique se os arquivos SVG existem
        if not os.path.exists(caminho_cabecalho):
            print(f"Erro: O arquivo {caminho_cabecalho} não foi encontrado!")
            return

        if not os.path.exists(caminho_rodape):
            print(f"Erro: O arquivo {caminho_rodape} não foi encontrado!")
            return

        # Converta o SVG para um objeto gráfico (renderable)
        cabecalho_svg = svg2rlg(caminho_cabecalho)
        rodape_svg = svg2rlg(caminho_rodape)

        cabecalho_svg.scale(0.85, 0.85)

        # Desenhe o cabeçalho (ajuste a posição conforme necessário)
        renderPDF.draw(cabecalho_svg, canvas, 45, altura - cabecalho_svg.height)

        # Desenhe o rodapé (ajuste a posição conforme necessário)
        renderPDF.draw(rodape_svg, canvas, 0, 0.5*cm)  # Posição (0, 0) para o rodapé
    
    paragrafos = split_text_by_br(texto)
    
    elementos.append(Paragraph("LAUDO TÉCNICO", title_style))
    elementos.append(Spacer(1,12))

    # elementos.append(Paragraph(texto, text_style))
    for i, paragrafo in enumerate(paragrafos):
        elementos.append(Paragraph(paragrafo, text_style))
    elementos.append(Spacer(1,12))

    dados_tabela = [
        ["", "Descrição", "Nº Patrimônio"],
        *[[f"Item {i + 1}", d.descricao, d.patrimonio ] for i, d in enumerate(dados)]
    ]

    # Tabela
    tabela = Table(dados_tabela, colWidths=[2 * cm, 10 * cm, 5 * cm])
    tabela.setStyle(TableStyle([
        # ("BACKGROUND", (0,0), (-1,0), colors.lightgrey),
        ("TEXTCOLOR", (0,0), (-1,0), colors.black),
        ("ALIGN", (0,0), (-1,-1), "LEFT"),
        ("GRID", (0,0), (-1,-1), 0.5, colors.grey),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTNAME", (0, 1), (0, -1), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 12),
        ("BOTTOMPADDING", (0, 0), (-1, 0), 2),
        ("TOPPADDING", (0, 0), (-1, 0), 2),
        ("VALIGN", (0,0), (-1, -1), "MIDDLE"),
        ("ALIGN", (0,0), (0, -1), "CENTER"),
        # ("BACKGROUND", (0, 1), (-1, -1), colors.whitesmoke),
    ]))

    elementos.append(tabela)

    # Geração do PDF
    doc.build(elementos, onFirstPage=cabecalho_rodape, onLaterPages=cabecalho_rodape)
    
    return caminho_saida
