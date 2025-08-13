import prisma from "@/lib/db";
import { gerarExcel } from "@/lib/excel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const params = req.nextUrl.searchParams;
        const tipo = params.get('tipo') || 'excel';

        const data = await prisma.patrimonios.findMany({
            omit: {
                id: true,
                tipo: true,
                medidas: true,
                largura: true,
                altura: true,
                comprimento: true,
                raio: true,
                diametro: true,
                peso: true,
                volume: true,
                local: true,
            },
            include: {
                tipo_fk: {
                    select: {
                        nome: true,
                    },
                },
                local_fk: {
                    select: {
                        nome: true,
                    },
                },
            },
        });

        let buffer: Buffer | Uint8Array | null = null;
        let filename: string = '';
        let contentType: string = '';

        if (tipo === 'excel') {
            buffer = gerarExcel(data, 'relatorio-patrimonios.ods');
            filename = 'relatorio-patrimonios.ods';
            contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        }

        if (!buffer) {
            return NextResponse.json({ message: 'Erro ao gerar o relatório!' }, { status: 400 });
        }

        const arrayBuffer = new Uint8Array(buffer);

        return new NextResponse(arrayBuffer, {
            status: 200,
            headers: {
                'Content-Type': contentType,
                'Content-Disposition': `attachment; filename="${filename}"`,
            },
        });
    } catch (err) {
        console.error('Erro ao gerar o relatório: ', err);
        return NextResponse.json({ message: 'Erro ao gerar o relatório!' }, { status: 500 });
    }
}