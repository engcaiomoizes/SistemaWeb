import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import ping from "ping";

export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '', 10);
        const searchTerm = searchParams.get('searchTerm') || '';
        const order = searchParams.get('order') || '';

        const skip = (page - 1) * limit;

        const where: any = searchTerm ? {
            OR: [
                { nome: { contains: searchTerm } },
                { apelido: { contains: searchTerm } },
            ]
        } : {};

        const orderBy: any = order != '' ? {
            nome: order
        } : {};

        const [locais, total] = await prisma.$transaction([
            prisma.locais.findMany({
                ...(isNaN(limit) ? {} : { take: limit, skip: skip }),
                where: where,
                orderBy: orderBy,
            }),
            prisma.locais.count({ where: where }),
        ]);

        // Pingar os IPs dos Locais
        const locaisComStatus = await Promise.all(
            locais.map(async (local: any) => {
                const result = await ping.promise.probe(local.faixa_ip!, { timeout: 1 });
                return {
                    ...local,
                    status: result.alive ? 'online' : 'offline',
                };
            })
        );

        return NextResponse.json({ message: 'OK', response: locaisComStatus, count: total }, { status: 200 });
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
        const local = await prisma.locais.create({
            data: {
                nome: data.nome,
                apelido: data.apelido ?? null,
                endereco: data.endereco,
                telefone_1: data.telefone_1 ?? null,
                telefone_2: data.telefone_2 ?? null,
                email_1: data.email_1 ?? null,
                email_2: data.email_2 ?? null,
                faixa_ip: data.faixa_ip ?? null,
                ativo: data.ativo ?? true
            },
        });

        const session = await getServerSession(authOptions);
        
        const log = await prisma.logs.create({
            data: {
                usuario: session?.user.id,
                descricao: `Cadastro do Local ${local.nome}`,
            },
        });

        return NextResponse.json({ message: 'Local cadastrado com sucesso!', local, log });
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
        const local = await prisma.locais.delete({
            where: {
                id: id
            },
        });

        const session = await getServerSession(authOptions);
        
        const log = await prisma.logs.create({
            data: {
                usuario: session?.user.id,
                descricao: `Exclusão do Local ${local.nome}`,
            },
        });

        return NextResponse.json({ message: 'Local deletado com sucesso!', local, log });
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
        const local = await prisma.locais.update({
            where: {
                id: data.id,
            },
            data: {
                nome: data.nome,
                apelido: data.apelido ?? null,
                endereco: data.endereco,
                telefone_1: data.telefone_1 ?? null,
                telefone_2: data.telefone_2 ?? null,
                email_1: data.email_1 ?? null,
                email_2: data.email_2 ?? null,
                faixa_ip: data.faixa_ip ?? null,
                ativo: data.ativo
            }
        });

        const session = await getServerSession(authOptions);
        
        const log = await prisma.logs.create({
            data: {
                usuario: session?.user.id,
                descricao: `Atualização do Local ${local.nome}`,
            },
        });

        return NextResponse.json({ message: 'Local atualizado com sucesso!', local, log }, { status: 200 });
    } catch (err) {
        return NextResponse.json({
            message: 'Error',
            err
        }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    const { id, ativo } = await req.json();

    try {
        const local = await prisma.locais.update({
            where: {
                id,
            },
            data: {
                ativo
            }
        });
        return NextResponse.json({ message: 'OK', local });
    } catch (err) {
        return NextResponse.json({
            message: 'Error',
            err
        }, { status: 500 });
    }
}