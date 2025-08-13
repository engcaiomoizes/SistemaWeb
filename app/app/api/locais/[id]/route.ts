import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/db";

export async function GET(req: NextRequest, { params }: any) {
    const { id } = await params;
    try {
        const response = await prisma.locais.findFirst({
            where: {
                id: Number(id),
            },
        });

        return Response.json({ message: 'OK', response }, { status: 200 });
    } catch (err) {
        return NextResponse.json({
            message: 'Error',
            err
        }, { status: 500 });
    }
}