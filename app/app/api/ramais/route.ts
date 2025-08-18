import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const local = parseInt(searchParams.get('local') || '', 10);

        const where: any = local ? {
            localId: local,
        } : {};

        const [ramais, total] = await prisma.$transaction([
            prisma.ramais.findMany({
                where: where,
            }),
            prisma.ramais.count({ where: where }),
        ]);

        return NextResponse.json({ message: 'OK', response: ramais, count: total }, { status: 200 });
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
        const ramal = await prisma.ramais.create({
            data: {
                numero: data.numero,
                nome: data.nome,
                setor: data.setor,
                tipo: data.tipo,
                localId: Number(data.localId),
            },
        });

        const session = await getServerSession(authOptions);
        
        const log = await prisma.logs.create({
            data: {
                usuario: session?.user.id,
                descricao: `Cadastro do Ramal ${ramal.numero}`,
            },
        });

        return NextResponse.json({ message: 'OK', ramal, log });
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
        const ramal = await prisma.ramais.delete({
            where: {
                id: id
            },
        });
        
        const session = await getServerSession(authOptions);
        
        const log = await prisma.logs.create({
            data: {
                usuario: session?.user.id,
                descricao: `Exclusão do Ramal ${ramal.numero}`,
            },
        });

        return NextResponse.json({ message: 'OK', ramal, log });
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
        const ramal = await prisma.ramais.update({
            where: {
                id: data.id,
            },
            data: {
                numero: data.numero,
                nome: data.nome,
                setor: data.setor,
                tipo: data.tipo,
                localId: Number(data.localId),
            }
        });

        const session = await getServerSession(authOptions);
        
        const log = await prisma.logs.create({
            data: {
                usuario: session?.user.id,
                descricao: `Atualização do Ramal ${ramal.numero}`,
            },
        });

        return NextResponse.json({ message: 'OK', ramal, log });
    } catch (err) {
        return NextResponse.json({
            message: 'Error',
            err
        }, { status: 500 });
    }
}