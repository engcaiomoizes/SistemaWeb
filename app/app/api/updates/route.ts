import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import { getCurrentDate } from "@/lib/string";

export async function GET() {
    try {
        const updates = await prisma.updates.findMany();

        return NextResponse.json({ message: 'OK', updates }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ message: 'Error', err }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const data = await req.json();

    try {
        const update = await prisma.updates.create({
            data: {
                numero: data.numero,
                resumo: data.resumo,
                notas: data.notas,
            },
        });

        return NextResponse.json({ message: 'Update cadastrado com sucesso!', update }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ message: 'Error', err }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    const data = await req.json();

    try {
        const update = await prisma.updates.update({
            where: {
                id: data.id,
            },
            data: {
                numero: data.numero,
                resumo: data.resumo,
                notas: data.notas,
                updated_at: new Date(getCurrentDate()),
            },
        });

        return NextResponse.json({ message: 'Update atualizado com sucesso!', update }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ message: 'Error', err }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    const { id } = await req.json();

    try {
        const update = await prisma.updates.delete({
            where: {
                id,
            },
        });

        return NextResponse.json({ message: 'Update deletado com sucesso!', update }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ message: 'Error', err }, { status: 500 });
    }
}