import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { num } = await req.json();

        const response = await prisma.patrimonios.findMany({
            where: {
                num_patrimonio: Number(num),
            },
            include: {
                tipo_fk: true,
            },
        });

        return NextResponse.json({ response }, { status: 200 });
    } catch (err) {
        console.log(err);
        return NextResponse.json({ message: 'Error', err }, { status: 500 });
    }
}