from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from reportlab.lib import colors
from datetime import datetime, date, timedelta
import calendar
import os

def gerar_folha_ponto(dados_funcionario, ano, mes, path_destino):
    nome_arquivo = os.path.join(path_destino, f"folha_ponto_{mes}_{ano}.pdf")
    c = canvas.Canvas(nome_arquivo, pagesize=A4)
    largura, altura = A4

    # Cabeçalho
    #

    # Dados do funcionário
    y = altura - 4 * cm
    c.setFont("Helvetica-Bold", 10)
    c.drawString(2 * cm, y, f"NOME: {dados_funcionario['nome']}")
    y -= 0.6 * cm
    c.drawString(2 * cm, y, f"MATRÍCULA: {dados_funcionario['matricula']}")
    y -= 0.6 * cm
    c.drawString(2 * cm, y, f"CARGO/FUNÇÃO: {dados_funcionario['cargo']}")
    y -= 0.6 * cm
    c.drawString(2 * cm, y, f"SEDE DE SERVIÇO: {dados_funcionario['sede']}")
    y -= 0.6 * cm
    c.drawString(2 * cm, y, f"RG: {dados_funcionario['rg']}")

    # Período
    periodo = f"Período: 01 a {calendar.monthrange(ano, mes)[1]} de {calendar.month_name[mes].upper()} de {ano}"
    c.drawRightString(largura - 2 * cm, altura - 4 * cm, periodo)

    # Cabeçalho da tabela
    y_tabela = altura - 6 * cm
    linha_altura = 0.6 * cm
    c.setFont("Helvetica-Bold", 8)
    c.drawString(2 * cm, y_tabela, "Dia")
    c.drawString(3 * cm, y_tabela, "Hora Entrada")
    c.drawString(5 * cm, y_tabela, "Saída Almoço")
    c.drawString(7 * cm, y_tabela, "Assinatura")
    c.drawString(10 * cm, y_tabela, "Retorno")
    c.drawString(12 * cm, y_tabela, "Hora Saída")
    c.drawString(14 * cm, y_tabela, "Assinatura")

    # Dias do mês
    c.setFont("Helvetica", 8)
    y = y_tabela - linha_altura
    for dia in range(1, calendar.monthrange(ano, mes)[1] + 1):
        data = date(ano, mes, dia)
        nome_dia = calendar.day_name[data.weekday()]

        if nome_dia == "Saturday":
            texto = "Sábado"
        elif nome_dia == "Sunday":
            texto = "Domingo"
        elif data == date(2025, 7, 9): # Exemplo: Feriado 9 de julho
            texto = "FERIADO"
        else:
            texto = ""
        
        c.drawString(2 * cm, y, f"{dia:02d} {texto}")

        if texto in ["Sábado", "Domingo", "FERIADO"]:
            c.drawString(3 * cm, y, "#######")
            c.drawString(5 * cm, y, "#######")
            c.drawString(7 * cm, y, "#######")
            c.drawString(10 * cm, y, "#######")
            c.drawString(12 * cm, y, "#######")
            c.drawString(14 * cm, y, "#######")
        
        y -= linha_altura
        if y < 2.5 * cm:
            c.showPage()
            y = altura - 2 * cm
    
    c.save()
    return nome_arquivo

# =======================================================================

from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
# from reportlab.lib import colors
# from reportlab.lib.pagesizes import A4
# from reportlab.lib.units import cm

def gerar_pdf_com_tabela(ano, mes, caminho_saida):
    doc = SimpleDocTemplate(caminho_saida, pagesize=A4)
    elementos = []
    estilos = getSampleStyleSheet()

    # Título
    elementos.append(Paragraph("Folha de Ponto", estilos['Title']))
    elementos.append(Spacer(1,12))

    # Cabeçalho + dados
    dados_tabela = [
        ["Primeiro Período", "", "", "", "Segundo Período", "", ""],
        ["Dia", "Hora Entrada", "Saída Almoço", "Assinatura", "Retorno Almoço", "Hora Saída", "Assinatura"],
        *[[str(f"{d:02d}"), "", "", "", "", "", ""] for d in range(1, calendar.monthrange(ano, mes)[1] + 1)]
    ]

    col_widths = [1.5*cm] + [2.8*cm] * 6

    # Tabela
    tabela = Table(dados_tabela, colWidths=col_widths)
    tabela.setStyle(TableStyle([
        ("SPAN", (0,0), (3,0)),
        ("SPAN", (4,0), (6,0)),
        ("BACKGROUND", (0,0), (-1,0), colors.lightgrey),
        ("TEXTCOLOR", (0,0), (-1,0), colors.black),
        ("ALIGN", (0,0), (-1,-1), "LEFT"),
        ("GRID", (0,0), (-1,-1), 0.5, colors.grey),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 9),
        ("BOTTOMPADDING", (0, 0), (-1, 0), 6),
        ("BACKGROUND", (0, 1), (-1, -1), colors.whitesmoke),
    ]))

    elementos.append(tabela)

    # Geração do PDF
    doc.build(elementos)
    return caminho_saida
