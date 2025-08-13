import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getCurrentDate } from "@/lib/string";

export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '', 10);
        const searchTerm = searchParams.get('searchTerm') || '';
        const order = searchParams.get('order') || '';

        const skip = (page - 1) * limit;

        const where: any = searchTerm ? {
            descricao: { contains: searchTerm },
        } : {};

        const orderBy: any = order != '' ? {
            descricao: order
        } : {};

        const [feriados, total] = await prisma.$transaction([
            prisma.feriados.findMany({
                ...(isNaN(limit) ? {} : { take: limit, skip: skip }),
                where: where,
                orderBy: orderBy,
            }),
            prisma.feriados.count({ where: where }),
        ]);

        return NextResponse.json({ message: 'OK', response: feriados, count: total }, { status: 200 });
    } catch (err) {
        return NextResponse.json({
            message: 'Error',
            err
        }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const data = await req.json();
    try {
        const feriado = await prisma.feriados.create({
            data: {
                data: data.data,
                descricao: data.descricao,
            },
        });

        const session = await getServerSession(authOptions);
        
        const log = await prisma.logs.create({
            data: {
                usuario: session?.user.id,
                descricao: `Cadastro do Feriado ${feriado.descricao}`,
            },
        });

        return NextResponse.json({ message: 'OK', feriado, log });
    } catch (err) {
        return NextResponse.json({
            message: 'Error',
            err
        }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    const { id } = await req.json();
    try {
        const feriado = await prisma.feriados.delete({
            where: {
                id: id
            },
        });
        
        const session = await getServerSession(authOptions);
        
        const log = await prisma.logs.create({
            data: {
                usuario: session?.user.id,
                descricao: `Exclusão do Feriado ${feriado.descricao}`,
            },
        });

        return NextResponse.json({ message: 'OK', feriado, log });
    } catch (err) {
        return NextResponse.json({
            message: 'Error',
            err
        }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    const data = await req.json();

    try {
        const feriado = await prisma.feriados.update({
            where: {
                id: data.id,
            },
            data: {
                data: data.data,
                descricao: data.descricao,
                updated_at: new Date(getCurrentDate()),
            }
        });

        const session = await getServerSession(authOptions);
        
        const log = await prisma.logs.create({
            data: {
                usuario: session?.user.id,
                descricao: `Atualização do Feriado ${feriado.descricao}`,
            },
        });

        return NextResponse.json({ message: 'OK', feriado, log });
    } catch (err) {
        return NextResponse.json({
            message: 'Error',
            err
        }, { status: 500 });
    }
}