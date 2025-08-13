import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/db";

export async function GET(req: NextRequest, { params }: any) {
    const { dateString } = await params;
    try {
        const response = await prisma.feriados.count({
            where: {
                data: dateString.replace(/-/g, '/'),
            },
        });

        return NextResponse.json({ feriado: response > 0 }, { status: 200 });
    } catch (err) {
        return NextResponse.json({
            message: 'Error',
            err
        }, { status: 500 });
    }
}