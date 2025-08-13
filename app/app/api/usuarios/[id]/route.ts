import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/db";

export async function GET(req: NextRequest, { params }: any) {
    const { id } = await params;
    try {
        const response = await prisma.usuarios.findFirst({
            where: {
                id: id,
            },
        });

        return NextResponse.json({ message: 'OK', response }, { status: 200 });
    } catch (err) {
        return NextResponse.json({
            message: 'Error',
            err
        }, { status: 500 });
    }
}

export async function PATCH(req: Request, { params }: any) {
    const { id } = await params;
    const { nivel } = await req.json();

    try {
        const response = await prisma.usuarios.update({
            where: {
                id: id,
            },
            data: {
                nivel: nivel,
            },
        });

        return NextResponse.json({ message: 'Nível definido com sucesso!', response }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ message: 'Error', err }, { status: 500 });
    }
}