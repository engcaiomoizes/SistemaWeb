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

def gerar_folhas(ano, mes, dados, holidays, dias_abertos, caminho_saida):
    doc = SimpleDocTemplate(caminho_saida, pagesize=A4, topMargin=3.5*cm, bottomMargin=1*cm, leftMargin=1.5*cm, rightMargin=1.5*cm)
    elementos_totais = []
    estilos = getSampleStyleSheet()

    custom_style = ParagraphStyle(
        name="Infos",
        fontName="Times-Bold",
        fontSize=12,
        alignment=0
    )
    custom_style_2 = ParagraphStyle(
        name="Infos",
        fontName="Times-Bold",
        fontSize=12,
        alignment=2
    )

    meses = [
        "JANEIRO", "FEVEREIRO", "MARÇO", "ABRIL", "MAIO", "JUNHO",
        "JULHO", "AGOSTO", "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO"
    ]

    feriados_set = {f["data"] for f in holidays}

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
    
    for d in dados:
        elementos = []
        _, numero_dias = calendar.monthrange(ano, mes)

        elementos.append(Paragraph("NOME: " + str(d["nome"]).upper(), custom_style))
        elementos.append(Spacer(1,10))
        elementos.append(Paragraph("MATRÍCULA: " + str(d["matricula"]).upper(), custom_style))
        elementos.append(Spacer(1,10))
        elementos.append(Paragraph("CARGO/FUNÇÃO: " + str(d["cargo"]).upper(), custom_style))
        elementos.append(Spacer(1,10))
        elementos.append(Paragraph("SEDE DE SERVIÇO: " + str(d["apelido"].strip() if d.get("apelido") and d["apelido"].strip() else d["nome_local"]).upper(), custom_style))
        elementos.append(Spacer(1,10))
        elementos.append(Paragraph("RG: " + str(d["rg"]).upper(), custom_style))
        elementos.append(Spacer(1,10))
        elementos.append(Paragraph(f"Período: 01 a {numero_dias} de {meses[mes - 1]} de {ano}", custom_style_2))
        elementos.append(Spacer(1,8))

        dados_tabela = [
            ["Primeiro Período", "", "", "", "Segundo Período", "", ""],
            ["Dia", "Hora Entrada", "Saída Almoço", "Assinatura", "Retorno Almoço", "Hora Saída", "Assinatura"],
        ]

        for day in range(1, numero_dias + 1):
            weekday = calendar.weekday(ano, mes, day)

            data_atual = f"{day:02d}/{mes:02d}/{ano}"

            if data_atual in feriados_set:
                dados_tabela.append([str(f"{day:02d}"), "FERIADO", "############", "############", "############", "############", "############"])
            else:
                if weekday == 5 and day not in dias_abertos:
                    dados_tabela.append([str(f"{day:02d}"), "Sábado", "############", "############", "############", "############", "############"])
                elif weekday == 6 and day not in dias_abertos:
                    dados_tabela.append([str(f"{day:02d}"), "Domingo", "############", "############", "############", "############", "############"])
                else:
                    dados_tabela.append([str(f"{day:02d}"), "", "", "", "", "", ""])


        col_widths = [1*cm, 2.7*cm, 2.7*cm, 3.6*cm, 2.7*cm, 2.7*cm, 3.6*cm]

        # Tabela
        tabela = Table(dados_tabela, colWidths=col_widths)
        tabela.setStyle(TableStyle([
            ("SPAN", (0,0), (3,0)),
            ("SPAN", (4,0), (6,0)),
            # ("BACKGROUND", (0,0), (-1,0), colors.lightgrey),
            ("TEXTCOLOR", (0,0), (-1,0), colors.black),
            ("ALIGN", (0,0), (-1,-1), "CENTER"),
            ("GRID", (0,0), (-1,-1), 0.5, colors.black),
            ("FONTNAME", (0, 0), (-1, -1), "Times-Bold"),
            ("FONTSIZE", (0, 0), (-1, -1), 10),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
            ("TOPPADDING", (0, 0), (-1, -1), 2),
            # ("BACKGROUND", (0, 1), (-1, -1), colors.whitesmoke),
        ]))

        elementos.append(tabela)

        elementos_totais.extend(elementos)
        elementos_totais.append(PageBreak())
    
    # Geração do PDF
    doc.build(elementos_totais, onFirstPage=cabecalho_rodape, onLaterPages=cabecalho_rodape)
    
    return caminho_saida
