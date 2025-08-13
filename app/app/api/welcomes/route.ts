import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const response = await prisma.welcomes.findMany();

        return NextResponse.json({ message: 'OK', response }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ message: 'Error', err }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const data = await req.json();

    try {
        const welcome = await prisma.welcomes.create({
            data: {
                title: data.title,
                content: data.content,
            },
        });

        return NextResponse.json({ message: 'Mensagem cadastrada com sucesso!', welcome }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ message: 'Error', err }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    const data = await req.json();

    try {
        const welcome = await prisma.welcomes.update({
            where: {
                id: data.id,
            },
            data: {
                title: data.title,
                content: data.content,
            },
        });

        return NextResponse.json({ message: 'Mensagem atualizada com sucesso!', welcome }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ message: 'Error', err }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    const { id, ativo } = await req.json();

    try {
        const welcome = await prisma.welcomes.update({
            where: {
                id,
            },
            data: {
                ativo,
            },
        });

        return NextResponse.json({ message: 'OK', welcome }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ message: 'Error', err }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    const { id } = await req.json();

    try {
        const welcome = await prisma.welcomes.delete({
            where: {
                id,
            },
        });

        return NextResponse.json({ message: 'Mensagem deletada com sucesso!', welcome }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ message: 'Error', err }, { status: 500 });
    }
}