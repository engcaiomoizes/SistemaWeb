from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm

def gerar_pdf_com_tabela(dados, caminho_saida):
    doc = SimpleDocTemplate(caminho_saida, pagesize=A4, topMargin=1 * cm, bottomMargin=1 * cm, leftMargin=1 * cm, rightMargin=1 * cm)
    elementos = []
    estilos = getSampleStyleSheet()

    # Título
    elementos.append(Paragraph("Relatório de Impressoras", estilos['Title']))
    elementos.append(Spacer(1,12))

    # Cabeçalho + dados
    dados_tabela = [
        ["Marca", "Modelo", "Local", "IP"],
        *[[str(d["marca"]), d["modelo"], d["apelido"].strip() if d.get("apelido") and d["apelido"].strip() else d["nome"], d["ip_addr"]] for d in dados]
    ]

    # Tabela
    tabela = Table(dados_tabela, colWidths=[3 * cm, 4 * cm, 5 * cm, 3 * cm])
    tabela.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (-1,0), colors.lightgrey),
        ("TEXTCOLOR", (0,0), (-1,0), colors.black),
        ("ALIGN", (0,0), (-1,-1), "LEFT"),
        ("GRID", (0,0), (-1,-1), 0.5, colors.grey),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 9),
        ("BOTTOMPADDING", (0, 0), (-1, 0), 6),
        # ("BACKGROUND", (0, 1), (-1, -1), colors.whitesmoke),
    ]))

    elementos.append(tabela)

    # Geração do PDF
    doc.build(elementos)
    return caminho_saida