import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        const response = await prisma.usuarios.findFirst({
            where: {
                email,
            },
        });

        if (response) {
            const nodemailer = require('nodemailer');

            const transporter = nodemailer.createTransport({
                port: process.env.NEXT_PRIVATE_PORT_SMTP,
                host: process.env.NEXT_PRIVATE_HOST_SMTP,
                auth: {
                    user: process.env.NEXT_PRIVATE_EMAIL_SMTP,
                    pass: process.env.NEXT_PRIVATE_SENHA_SMTP,
                },
                secure: true,
            });

            await transporter.sendMail({
                from: process.env.NEXT_PRIVATE_EMAIL_SMTP,
                to: response.email,
                subject: 'Sistema SMAS - Redefinição de Senha',
                html: `Redefinição de Senha do usuário <b>${response.nome}</b>.`,
            });

            return NextResponse.json({ message: 'E-mail enviado com sucesso!' }, { status: 200 });
        } else {
            return NextResponse.json({ message: 'E-mail não cadastrado!' }, { status: 400 });
        }
    } catch (err) {
        return NextResponse.json({ message: 'Error', err }, { status: 500 });
    }
}