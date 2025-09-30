import prisma from "@/lib/db";
// import { generateRandomString } from "@/lib/string";
import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/bcrypt";

function generateRandomString(length: number) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*";
    let result = "";
    const randomArray = new Uint8Array(length);
    crypto.getRandomValues(randomArray);
    randomArray.forEach((number) => {
        result += chars[number % chars.length];
    });
    return result;
}

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        const response = await prisma.usuarios.findFirst({
            where: {
                email,
            },
        });

        if (response) {
            const novaSenha = generateRandomString(10);

            const response2 = await prisma.usuarios.update({
                data: {
                    senha: await hashPassword(novaSenha),
                },
                where: {
                    id: response.id,
                },
            });

            if (response2) {
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
                    html: `Olá, <b>${response.nome}</b>.<br/>Esta é sua nova senha: <b>${novaSenha}</b>`,
                });

                return NextResponse.json({ message: 'E-mail enviado com sucesso!' }, { status: 200 });
            } else {
                return NextResponse.json({ message: 'Não foi possível redefinir sua senha.' }, { status: 400 });
            }
        } else {
            return NextResponse.json({ message: 'E-mail não cadastrado!' }, { status: 400 });
        }
    } catch (err) {
        return NextResponse.json({ message: 'Error', err }, { status: 500 });
    }
}