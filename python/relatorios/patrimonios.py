from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
import textwrap

def quebrar_texto(texto, largura_maxima):
    # largura_por_caractere = 0.6
    # largura_maxima_pt = largura_maxima * 28.35
    # num_caracteres_por_linha = int(largura_maxima_pt / largura_por_caractere)

    return textwrap.fill(texto, width=34).split('\n')

def gerar_relatorio(dados, caminho_saida):
    doc = SimpleDocTemplate(caminho_saida, pagesize=A4, topMargin=1 * cm, bottomMargin=1 * cm, leftMargin=1 * cm, rightMargin=1 * cm)
    elementos = []
    estilos = getSampleStyleSheet()

    # Título
    elementos.append(Paragraph("Relatório de Patrimônios", estilos['Title']))
    elementos.append(Spacer(1,12))

    # Cabeçalho + dados
    dados_tabela = [
        ["Nº Patrimônio", "Tipo", "Descrição", "Local"],
        *[[str(d["patrimonio"]), d["tipo_nome"], quebrar_texto(d["descricao"].strip() if d.get("descricao") else "", largura_maxima=7), d["apelido"].strip() if d.get("apelido") and d["apelido"].strip() else d["nome_local"]] for d in dados]
    ]

    for i, linha in enumerate(dados_tabela[1:]):
        linha[2] = "\n".join(linha[2])

    # Tabela
    tabela = Table(dados_tabela, colWidths=[4 * cm, 3 * cm, 7 * cm, 4 * cm])
    tabela.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (-1,0), colors.lightgrey),
        ("TEXTCOLOR", (0,0), (-1,0), colors.black),
        ("ALIGN", (0,0), (-1,-1), "LEFT"),
        ("GRID", (0,0), (-1,-1), 0.5, colors.grey),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 9),
        ("BOTTOMPADDING", (0, 0), (-1, 0), 2),
        ("TOPPADDING", (0, 0), (-1, 0), 2),
        ("VALIGN", (0,0), (-1, -1), "MIDDLE"),
        # ("BACKGROUND", (0, 1), (-1, -1), colors.whitesmoke),
    ]))

    elementos.append(tabela)

    # Geração do PDF
    doc.build(elementos)
    return caminho_saida