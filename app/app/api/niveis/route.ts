import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import prisma from "@/lib/db";
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

        const [niveis, total] = await prisma.$transaction([
            prisma.niveis.findMany({
                ...(isNaN(limit) ? {} : { take: limit, skip: skip }),
                where: where,
                orderBy: orderBy,
            }),
            prisma.niveis.count({ where: where }),
        ]);

        return NextResponse.json({ message: 'OK', response: niveis, count: total }, { status: 200 });
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
        const nivel = await prisma.niveis.create({
            data: {
                nome: data.nome,
                administrador: data.administrador,
                cadastrar_usuarios: data.cadastrar_usuarios,
                cadastrar_locais: data.cadastrar_locais,
                cadastrar_niveis: data.cadastrar_niveis,
                cadastrar_patrimonios: data.cadastrar_patrimonios,
                cadastrar_tipos: data.cadastrar_tipos,
                cadastrar_ramais: data.cadastrar_ramais,
                cadastrar_updates: data.cadastrar_updates,
                cadastrar_funcionarios: data.cadastrar_funcionarios,
                cadastrar_feriados: data.cadastrar_feriados,
                cadastrar_impressoras: data.cadastrar_impressoras,
            },
        });

        const session = await getServerSession(authOptions);

        const log = await prisma.logs.create({
            data: {
                usuario: session?.user.id,
                descricao: `Cadastro do Nível ${nivel.nome}`,
            },
        });

        return NextResponse.json({ message: 'OK', nivel, log });
    } catch (err) {
        console.log(err);
        return NextResponse.json({
            message: 'Error',
            err
        }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    const { id } = await req.json();
    try {
        const nivel = await prisma.niveis.delete({
            where: {
                id: id
            },
        });

        const session = await getServerSession(authOptions);

        const log = await prisma.logs.create({
            data: {
                usuario: session?.user.id,
                descricao: `Exclusão do Nível ${nivel.nome}`,
            },
        });

        return NextResponse.json({ message: 'OK', nivel, log });
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
        const nivel = await prisma.niveis.update({
            where: {
                id: data.id,
            },
            data: {
                nome: data.nome,
                administrador: data.administrador,
                cadastrar_usuarios: data.cadastrar_usuarios,
                cadastrar_locais: data.cadastrar_locais,
                cadastrar_niveis: data.cadastrar_niveis,
                cadastrar_patrimonios: data.cadastrar_patrimonios,
                cadastrar_tipos: data.cadastrar_tipos,
                cadastrar_ramais: data.cadastrar_ramais,
                cadastrar_updates: data.cadastrar_updates,
                cadastrar_funcionarios: data.cadastrar_funcionarios,
                cadastrar_feriados: data.cadastrar_feriados,
                cadastrar_impressoras: data.cadastrar_impressoras,
            }
        });

        const session = await getServerSession(authOptions);

        const log = await prisma.logs.create({
            data: {
                usuario: session?.user.id,
                descricao: `Atualização do Nível ${nivel.nome}`,
            },
        });

        return NextResponse.json({ message: 'OK', nivel, log });
    } catch (err) {
        return NextResponse.json({
            message: 'Error',
            err
        }, { status: 500 });
    }
}