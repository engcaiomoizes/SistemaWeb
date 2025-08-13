import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/db";

import { hashPassword } from "@/lib/bcrypt";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET(req: NextRequest) {
    try {
        const response = await prisma.usuarios.findMany({
            include: {
                nivel_fk: true,
            },
            omit: {
                foto: true,
            },
        });

        return NextResponse.json({ message: 'OK', response });
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
        const user = await prisma.usuarios.create({
            data: {
                login: data.login,
                senha: await hashPassword(data.senha),
                nome: data.nome,
                email: data.email,
                cargo: data.cargo,
                ativo: data.ativo ?? true
            },
        });

        const session = await getServerSession(authOptions);
        
        const log = await prisma.logs.create({
            data: {
                usuario: session?.user.id,
                descricao: `Cadastro do Usuário ${user.nome}`,
            },
        });

        return NextResponse.json({ message: 'OK', user, log });
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
        //const session = await fetch(`${process.env.API_URL}/login/${id}`);

        const session = await getServerSession(authOptions);

        if (session?.user.id == id) {
            return NextResponse.json({ message: 'Você não pode excluir o usuário que você está utilizando!' }, { status: 400 });
        }

        const user = await prisma.usuarios.delete({
            where: {
                id: id
            },
        });

        const log = await prisma.logs.create({
            data: {
                usuario: session?.user.id,
                descricao: `Exclusão do Usuário ${user.nome}`,
            },
        });

        return NextResponse.json({ message: 'OK', user, log }, { status: 200 });
    } catch (err) {
        console.log(err);
        return NextResponse.json({
            message: 'Error',
            err
        }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    const data = await req.json();

    try {
        const user = await prisma.usuarios.update({
            where: {
                id: data.id,
            },
            data: {
                login: data.login,
                nome: data.nome,
                email: data.email,
                cargo: data.cargo,
            }
        });

        const session = await getServerSession(authOptions);
        
        const log = await prisma.logs.create({
            data: {
                usuario: session?.user.id,
                descricao: `Atualização do Usuário ${user.nome}`,
            },
        });

        return NextResponse.json({ message: 'OK', user, log });
    } catch (err) {
        return NextResponse.json({
            message: 'Error',
            err
        }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    const { id, loggedId, ativo } = await req.json();

    if (id === loggedId)
        return NextResponse.json({ message: 'Você não pode desativar o usuário que você está utilizando!' }, { status: 400 });

    try {
        const user = await prisma.usuarios.update({
            where: {
                id,
            },
            data: {
                ativo
            }
        });
        return Response.json({ message: 'OK', user }, { status: 200 });
    } catch (err) {
        return NextResponse.json({
            message: 'Error',
            err
        }, { status: 500 });
    }
}