import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { message } = await req.json();

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
            to: process.env.NEXT_PUBLIC_EMAIL_ADDRESS,
            subject: 'Sistema SMAS - Report - Lista de Ramais',
            html: `${message}`,
        });

        return NextResponse.json({ message: "Mensagem enviada com sucesso! Em breve o administrador do sistema solucionará o problema." }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: "Error", err }, { status: 500 });
    }
}