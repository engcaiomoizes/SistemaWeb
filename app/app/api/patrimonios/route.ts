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
        const options = searchParams.get('options') || '';
        const locais = searchParams.get('locais') || '';
        const order = searchParams.get('order') || '';
        const by = searchParams.get('by') || '';

        const skip = (page - 1) * limit;

        let where: any = {};
        const andFilters: any[] = [];

        if (searchTerm) {
            where = {
                OR: [
                    { descricao: { contains: searchTerm } },
                    { num_patrimonio: searchTerm && /^\d+$/.test(searchTerm) ? { equals: parseInt(searchTerm) } : undefined },
                    { orgao_patrimonio: { contains: searchTerm } },
                    { tipo_fk: { nome: { contains: searchTerm } } },
                    { local_fk: { nome: { contains: searchTerm } } },
                    { local_fk: { apelido: { contains: searchTerm } } },
                ],
            };
        }

        if (options) {
            const array = options.split(',');

            const tipos = array.map(tipo => ({ tipo: { equals: parseInt(tipo) } }));

            andFilters.push({ OR: tipos });
        }

        if (locais) {
            const v_array = locais.split(',');

            const v_locais = v_array.map(local => ({ local: { equals: parseInt(local) } }));

            andFilters.push({ OR: v_locais });
        }

        if (andFilters.length > 0) {
            where = searchTerm ? {
                ...where,
                AND: andFilters,
            } : {
                AND: andFilters,
            };
        }

        const orderBy: any = order != '' && by != '' ? {
            [by]: order,
        } : {};

        const [patrimonios, total] = await prisma.$transaction([
            prisma.patrimonios.findMany({
                include: {
                    tipo_fk: true,
                    local_fk: true,
                },
                //skip: skip,
                //take: limit,
                ...(isNaN(limit) ? {} : { take: limit, skip: skip }),
                where: where,
                orderBy: orderBy,
            }),
            prisma.patrimonios.count({ where: where }),
        ]);

        return Response.json({ message: 'OK', response: patrimonios, count: total }, { status: 200 });
    } catch (err) {
        console.log(err);
        return NextResponse.json({
            message: 'Error',
            err,
        }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const data = await req.json();
    try {
        const patrimonio = await prisma.patrimonios.create({
            data: {
                tipo: Number(data.tipo),
                descricao: data.descricao,
                num_patrimonio: Number(data.num_patrimonio),
                orgao_patrimonio: data.orgao_patrimonio,
                largura: Number(data.largura),
                altura: Number(data.altura),
                comprimento: Number(data.comprimento),
                raio: Number(data.raio),
                diametro: Number(data.diametro),
                peso: Number(data.peso),
                volume: Number(data.volume),
                local: Number(data.local),
                local_fisico: data.local_fisico,
                observacoes: data.observacoes,
                ativo: data.ativo,
            },
        });

        const session = await getServerSession(authOptions);
        
        const log = await prisma.logs.create({
            data: {
                usuario: session?.user.id,
                descricao: `Cadastro do Patrimônio ${patrimonio.num_patrimonio} ${patrimonio.orgao_patrimonio}.`,
            },
        });

        return NextResponse.json({ message: 'Patrimônio cadastrado com sucesso!', patrimonio, log });
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
        const patrimonio = await prisma.patrimonios.delete({
            where: {
                id: id
            },
        });

        const session = await getServerSession(authOptions);
        
        const log = await prisma.logs.create({
            data: {
                usuario: session?.user.id,
                descricao: `Exclusão do Patrimônio ${patrimonio.num_patrimonio} ${patrimonio.orgao_patrimonio}.`,
            },
        });

        return NextResponse.json({ message: 'Patrimônio deletado com sucesso!', patrimonio, log });
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
        const patrimonio = await prisma.patrimonios.update({
            where: {
                id: data.id,
            },
            data: {
                tipo: Number(data.tipo),
                descricao: data.descricao,
                num_patrimonio: Number(data.num_patrimonio),
                orgao_patrimonio: data.orgao_patrimonio,
                largura: Number(data.largura),
                altura: Number(data.altura),
                comprimento: Number(data.comprimento),
                raio: Number(data.raio),
                diametro: Number(data.diametro),
                peso: Number(data.peso),
                volume: Number(data.volume),
                local: Number(data.local),
                local_fisico: data.local_fisico,
                observacoes: data.observacoes,
                ativo: data.ativo,
                updated_at: new Date(getCurrentDate()),
            }
        });

        const session = await getServerSession(authOptions);
        
        const log = await prisma.logs.create({
            data: {
                usuario: session?.user.id,
                descricao: `Atualização do Patrimônio ${patrimonio.num_patrimonio} ${patrimonio.orgao_patrimonio}.`,
            },
        });

        return NextResponse.json({ message: 'Patrimônio atualizado com sucesso!', patrimonio });
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
        const patrimonio = await prisma.patrimonios.update({
            where: {
                id,
            },
            data: {
                ativo
            }
        });
        return NextResponse.json({ message: 'OK', patrimonio });
    } catch (err) {
        return NextResponse.json({
            message: 'Error',
            err
        }, { status: 500 });
    }
}