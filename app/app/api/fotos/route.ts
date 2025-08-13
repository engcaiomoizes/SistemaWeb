import prisma from "@/lib/db";
import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";
import fs from "fs/promises";

const uploadDir = path.join(process.cwd(), 'uploads');

export async function POST(req: NextRequest) {
    try {
        const contentType = req.headers.get('content-type');
        if (!contentType || !contentType.includes('multipart/form-data')) {
            return NextResponse.json({ message: 'Tipo de conteúdo inválido.' }, { status: 400 });
        }

        const formData = await req.formData();

        const file = formData.get('file') as File;
        const patrimonioId = formData.get('patrimonioId');

        if (!file || !patrimonioId) {
            return NextResponse.json({ message: 'Arquivo ou patrimonioId ausente.' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const extension = file.name.split('.').pop();
        const fileName = `${Date.now()}-${randomUUID()}.${extension}`;
        const filePath = path.join(uploadDir, fileName);

        await writeFile(filePath, buffer);

        const response = await prisma.fotos.create({
            data: {
                patrimonioId: String(patrimonioId),
                url: fileName,
            },
        });

        return NextResponse.json({ message: 'Foto adicionada!', response }, { status: 200 });
    } catch (err) {
        console.log(err);
        return NextResponse.json({ message: 'Error', err }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    const { id } = await req.json();

    try {
        // 1. Buscar a foto no banco de dados
        const foto = await prisma.fotos.findUnique({
            where: { id },
        });

        if (!foto)
            return NextResponse.json({ message: 'Foto não encontrada no banco de dados.' }, { status: 404 });

        // 2. Construir o caminho do arquivo
        const filePath = path.join(uploadDir, foto.url);

        // 3. Excluir o arquivo do sistema de arquivos
        try {
            await fs.unlink(filePath);
        } catch (fileErr) {
            console.warn("Arquivo não encontrado no disco ou erro ao deletar: ", fileErr);
        }

        // 4. Deletar o registro do banco
        const response = await prisma.fotos.delete({
            where: {
                id,
            },
        });

        return NextResponse.json({ message: 'Foto deletada com sucesso!', response }, { status: 200 });
    } catch (err) {
        console.log(err);
        return NextResponse.json({ message: 'Error', err }, { status: 500 });
    }
}
