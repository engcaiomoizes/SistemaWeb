import prisma from "@/lib/db";

export async function GET() {
    try {
        const response = await prisma.patrimonios.count();

        return Response.json({ response }, { status: 200 });
    } catch (err) {
        return Response.json({ err }, { status: 500 });
    }
}