import { NextResponse } from "next/server";

import prisma from "@/lib/db";

import { hashPassword } from "@/lib/bcrypt";

export async function POST(req: Request) {
    const { login, senha, nome, email, cargo } = await req.json();

    if (!login || !senha || !nome) {
        return NextResponse.json({ message: 'Preencha todos os campos obrigatórios!' }, { status: 400 });
    }

    try {
        const user = await prisma.usuarios.create({
            data: {
                login,
                senha: await hashPassword(senha),
                nome,
                email,
                cargo,
                ativo: false,
            },
        });

        return NextResponse.json({ message: 'Usuário cadastrado com sucesso!', user }, { status: 200 });
    } catch (err) {
        return NextResponse.json({
            message: 'Error',
            err
        }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    const { id, novaSenha } = await req.json();

    try {
        const user = await prisma.usuarios.update({
            where: {
                id: id,
            },
            data: {
                senha: await hashPassword(novaSenha),
            },
        });

        return NextResponse.json({ message: 'Senha alterada com sucesso!', user }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ message: 'Error', err }, { status: 500 });
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
                nome: data.nome,
                login: data.login,
                cargo: data.cargo,
                email: data.email,
                foto: data.foto,
            },
        });

        return NextResponse.json({ message: 'Informações atualizadas com sucesso!', user }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ message: 'Error', err }, { status: 500 });
    }
}