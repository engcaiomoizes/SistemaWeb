import prisma from "@/lib/db";
import { gerarExcel } from "@/lib/excel";
import { NextRequest, NextResponse } from "next/server";
import { renderToStream } from '@react-pdf/renderer';
import { Readable } from "stream";

export async function GET(req: NextRequest) {
    try {
        const params = req.nextUrl.searchParams;
        const tipo = params.get('tipo') || 'excel';

        const data = await prisma.locais.findMany();

        let buffer: Buffer | Uint8Array | null = null;
        let filename: string = '';
        let contentType: string = '';

        if (tipo === 'excel') {
            buffer = gerarExcel(data, 'relatorio-locais.xlsx');
            filename = 'relatorio-locais.xlsx';
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