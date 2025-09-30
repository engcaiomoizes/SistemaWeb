import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const local = parseInt(searchParams.get('local') || '', 10);

        const where: any = local ? {
            localId: local,
        } : {};

        const response = await prisma.ramais.findMany({
            where: where,
        });

        return NextResponse.json({ response }, { status: 200 });
    } catch (err) {
        return NextResponse.json({
            message: 'Error',
            err
        }, { status: 500 });
    }
}