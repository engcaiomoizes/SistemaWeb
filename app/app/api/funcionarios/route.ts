import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;

        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '', NaN);
        const searchTerm = searchParams.get('searchTerm') || '';
        const order = searchParams.get('order') || '';
        const locais = searchParams.get('locais') || '';

        const skip = (page - 1) * limit;

        const filters: any[] = [];
        let where: any = {};

        where = searchTerm ? {
            OR: [
                { nome: { contains: searchTerm } },
            ]
        } : {};

        if (locais) {
            const v_array = locais.split(',');
            const v_locais = v_array.map(local => ({ local: { equals: parseInt(local) } }));
            filters.push({ OR: v_locais });
        }

        if (filters.length > 0) {
            where = {
                ...where,
                AND: filters,
            };
        }

        const orderBy: any = order != '' ? {
            nome: order
        } : {};

        const [funcionarios, total] = await prisma.$transaction([
            prisma.funcionarios.findMany({
                ...(isNaN(limit) ? {} : { take: limit, skip: skip }),
                where: where,
                orderBy: orderBy,
                include: {
                    local_fk: true,
                },
            }),
            prisma.funcionarios.count({ where: where }),
        ]);

        return NextResponse.json({ message: 'OK', response: funcionarios, count: total }, { status: 200 });
    } catch (err) {
        console.log(err);
        return NextResponse.json({
            message: 'Error',
            err
        }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const data = await req.json();
    try {
        const funcionario = await prisma.funcionarios.create({
            data: {
                nome: data.nome.toUpperCase(),
                rg: data.rg,
                matricula: data.matricula,
                cargo: data.cargo,
                local: data.local,
                local_fisico: data.local_fisico,
                observacoes: data.observacoes,
            },
        });

        const session = await getServerSession(authOptions);
        
        const log = await prisma.logs.create({
            data: {
                usuario: session?.user.id,
                descricao: `Cadastro do Funcionário ${funcionario.nome}`,
            },
        });

        return NextResponse.json({ message: 'Funcionário cadastrado com sucesso!', funcionario, log });
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
        const funcionario = await prisma.funcionarios.delete({
            where: {
                id: id
            },
        });

        const session = await getServerSession(authOptions);
        
        const log = await prisma.logs.create({
            data: {
                usuario: session?.user.id,
                descricao: `Exclusão do Funcionário ${funcionario.nome}`,
            },
        });

        return NextResponse.json({ message: 'Funcionário deletado com sucesso!', funcionario, log });
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
        const funcionario = await prisma.funcionarios.update({
            where: {
                id: data.id,
            },
            data: {
                nome: data.nome,
                rg: data.rg,
                matricula: data.matricula,
                cargo: data.cargo,
                local: Number(data.local),
                local_fisico: data.local_fisico,
                observacoes: data.observacoes,
            }
        });

        const session = await getServerSession(authOptions);
        
        const log = await prisma.logs.create({
            data: {
                usuario: session?.user.id,
                descricao: `Atualização do Funcionário ${funcionario.nome}`,
            },
        });

        return NextResponse.json({ message: 'Funcionário atualizado com sucesso!', funcionario, log }, { status: 200 });
    } catch (err) {
        return NextResponse.json({
            message: 'Error',
            err
        }, { status: 500 });
    }
}
