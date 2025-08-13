import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
    try {
        const response = await prisma.logs.findMany({
            include: {
                usuario_fk: {
                    omit: {
                        foto: true,
                    },
                },
            },
        });

        return NextResponse.json({ message: 'OK', response }, { status: 200 });
    } catch (err) {
        console.log(err);
        return NextResponse.json({ message: 'Error', err }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const data = await req.json();

    try {
        const response = await prisma.logs.create({
            data: {
                usuario: data.usuario,
                descricao: data.descricao,
            },
        });

        return NextResponse.json({ message: 'Log registrado!', response }, { status: 200 });
    } catch (err) {
        console.log(err);
        return NextResponse.json({ message: 'Error', err }, { status: 500 });
    }
}