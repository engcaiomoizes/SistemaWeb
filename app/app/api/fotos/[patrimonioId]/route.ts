import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: any) {
    const { patrimonioId } = await params;
    try {
        const response = await prisma.fotos.findMany({
            where: {
                patrimonioId: patrimonioId,
            },
            // include: {
            //     patrimonio_fk: true,
            // },
        });

        return NextResponse.json({ message: 'OK', response }, { status: 200 });
    } catch (err) {
        console.log(err);
        return NextResponse.json({ message: 'Error', err }, { status: 500 });
    }
}