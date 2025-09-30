import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;

        const response = await prisma.locais.findMany();

        return NextResponse.json({ response }, { status: 200 });
    } catch (err) {
        return NextResponse.json({
            message: 'Error',
            err
        }, { status: 500 });
    }
}