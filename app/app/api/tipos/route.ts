import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '', 10);
        const searchTerm = searchParams.get('searchTerm') || '';
        const order = searchParams.get('order') || '';

        const skip = (page - 1) * limit;

        const where: any = searchTerm ? {
            nome: { contains: searchTerm },
        } : {};

        const orderBy: any = order != '' ? {
            nome: order
        } : {};

        const [tipos, total] = await prisma.$transaction([
            prisma.tipos.findMany({
                ...(isNaN(limit) ? {} : { take: limit, skip: skip }),
                where: where,
                orderBy: orderBy,
            }),
            prisma.tipos.count({ where: where }),
        ]);

        return NextResponse.json({ message: 'OK', response: tipos, count: total }, { status: 200 });
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
        const tipo = await prisma.tipos.create({
            data: {
                nome: data.nome,
            },
        });

        const session = await getServerSession(authOptions);
        
        const log = await prisma.logs.create({
            data: {
                usuario: session?.user.id,
                descricao: `Cadastro do Tipo ${tipo.nome}`,
            },
        });

        return NextResponse.json({ message: 'OK', tipo, log });
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
        const tipo = await prisma.tipos.delete({
            where: {
                id: id
            },
        });

        const session = await getServerSession(authOptions);
        
        const log = await prisma.logs.create({
            data: {
                usuario: session?.user.id,
                descricao: `Exclusão do Tipo ${tipo.nome}`,
            },
        });

        return NextResponse.json({ message: 'OK', tipo, log });
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
        const tipo = await prisma.tipos.update({
            where: {
                id: data.id,
            },
            data: {
                nome: data.nome,
            }
        });

        const session = await getServerSession(authOptions);
        
        const log = await prisma.logs.create({
            data: {
                usuario: session?.user.id,
                descricao: `Atualização do Tipo ${tipo.nome}`,
            },
        });

        return Response.json({ message: 'OK', tipo, log });
    } catch (err) {
        return NextResponse.json({
            message: 'Error',
            err
        }, { status: 500 });
    }
}