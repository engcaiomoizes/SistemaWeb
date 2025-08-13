import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

async function dataURLtoBuffer(dataURL: string): Promise<Buffer> {
    const base64String = dataURL.split(',')[1];
    const buffer = Buffer.from(base64String, 'base64');
    return buffer;
}

// Função para converter Buffer para Data URL
function getImageDataURLFromBuffer(buffer: any, contentType: string): string {
    if (!buffer) {
        console.error('Erro: buffer é nulo ou indefinido.');
        return '';
    }

    if (buffer instanceof Uint8Array) {
        // Converter Uint8Array para Buffer
        buffer = Buffer.from(buffer);
    }

    if (!Buffer.isBuffer(buffer)) {
        console.error('Erro: buffer não é um objeto Buffer válido:', buffer);
        return ''; // Ou alguma outra string padrão/de erro
    }

    try {
        const base64 = buffer.toString('base64');
        return `data:${contentType};base64,${base64}`;
    } catch (error) {
        console.error('Erro ao converter o Buffer para Base64:', error);
        return ''; // Ou alguma outra string padrão/de erro
    }
}

export async function POST(req: Request) {
    try {
        const data = await req.json();
        const userId = data.id;
        const croppedImage = data.croppedImage as string;

        if (!croppedImage)
            return NextResponse.json({ message: 'Imagem cortada não encontrada.' }, { status: 400 });

        // Converter Data URL para um Buffer
        const profilePictureBuffer = await dataURLtoBuffer(croppedImage);

        // Atualizar o usuário no banco de dados com a nova imagem
        const user = await prisma.usuarios.update({
            where: {
                id: userId,
            },
            data: {
                foto: profilePictureBuffer,
            },
        });

        return NextResponse.json({ message: 'Foto de perfil atualizada com sucesso!', user }, { status: 200 });
    } catch (err) {
        console.log(err);
        NextResponse.json({ message: 'Error', err }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}

export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;

        if (!searchParams.get('id'))
            return NextResponse.json({ message: 'Nenhum usuário selecionado.' }, { status: 400 });

        const id = searchParams.get('id') || '';

        const response = await prisma.usuarios.findUnique({
            where: {
                id,
            },
            select: {
                foto: true,
            },
        });

        if (!response)
            return NextResponse.json({ message: 'Usuário não encontrado.' }, { status: 404 });

        let fotoDataUrl: string | null = null;
        if (response.foto)
            fotoDataUrl = getImageDataURLFromBuffer(response.foto, 'image/jpeg');

        return NextResponse.json({ message: 'Foto obtida com sucesso!', fotoDataUrl }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ message: 'Error', err }, { status: 500 });
    }
}