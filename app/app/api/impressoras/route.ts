import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import prisma from "@/lib/db";
import { authOptions } from "@/lib/authOptions";
import { getCurrentDate } from "@/lib/string";

import ping from "ping";

export async function GET(req: NextRequest) {
    try {
        const [impressoras, total] = await prisma.$transaction([
            prisma.impressoras.findMany({
                include: {
                    local_fk: true,
                },
            }),
            prisma.impressoras.count(),
        ]);

        // Pingar os IPs das impressoras
        const impressorasComStatus = await Promise.all(
            impressoras.map(async (impressora: any) => {
                const result = await ping.promise.probe(impressora.ip_addr, { timeout: 1 });
                return {
                    ...impressora,
                    status: result.alive ? 'online' : 'offline',
                };
            })
        );

        return NextResponse.json({ message: 'OK', response: impressorasComStatus, count: total }, { status: 200 });
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
        const impressora = await prisma.impressoras.create({
            data: {
                marca: data.marca,
                modelo: data.modelo,
                observacoes: data.observacoes,
                localId: data.localId,
                ip_addr: data.ip_addr,
            },
        });

        const session = await getServerSession(authOptions);

        const log = await prisma.logs.create({
            data: {
                usuario: session?.user.id,
                descricao: `Cadastro da Impressora ${impressora.marca} ${impressora.modelo}`,
            },
        });

        return NextResponse.json({ message: 'OK', impressora, log });
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
        const impressora = await prisma.impressoras.delete({
            where: {
                id: id
            },
        });

        const session = await getServerSession(authOptions);

        const log = await prisma.logs.create({
            data: {
                usuario: session?.user.id,
                descricao: `Exclusão da Impressora ${impressora.marca} ${impressora.modelo}`,
            },
        });

        return NextResponse.json({ message: 'OK', impressora, log });
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
        const impressora = await prisma.impressoras.update({
            where: {
                id: data.id,
            },
            data: {
                marca: data.marca,
                modelo: data.modelo,
                observacoes: data.observacoes,
                localId: data.localId,
                ip_addr: data.ip_addr,
                updated_at: new Date(getCurrentDate()),
            }
        });

        const session = await getServerSession(authOptions);

        const log = await prisma.logs.create({
            data: {
                usuario: session?.user.id,
                descricao: `Atualização da Impressora ${impressora.marca} ${impressora.modelo}`,
            },
        });

        return NextResponse.json({ message: 'OK', impressora, log });
    } catch (err) {
        return NextResponse.json({
            message: 'Error',
            err
        }, { status: 500 });
    }
}