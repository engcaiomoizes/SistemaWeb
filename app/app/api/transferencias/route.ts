import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET() {
    try {
        const response = await prisma.transferencias.findMany();

        return NextResponse.json({ message: 'OK', response }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ message: 'Error', err }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const data = await req.json();

    try {
        const update = await prisma.patrimonios.update({
            where: {
                id: data.id,
            },
            data: {
                local: data.localPara,
            },
        });

        if (update) {
            const transferencia = await prisma.transferencias.create({
                data: {
                    patrimonioId: data.id,
                    localDe: Number(data.localDe),
                    localPara: Number(data.localPara),
                    observacoes: data.observacoes,
                },
                include: {
                    localDe_fk: true,
                    localPara_fk: true,
                },
            });

            const session = await getServerSession(authOptions);

            const log = await prisma.logs.create({
                data: {
                    usuario: session?.user.id,
                    descricao: `Transferência do Patrimônio ${update.num_patrimonio} ${update.orgao_patrimonio}`,
                    detalhes: `Transferência do Patrimônio ${update.num_patrimonio} ${update.orgao_patrimonio}, de ${transferencia.localDe_fk?.nome} para ${transferencia.localPara_fk?.nome}.`,
                },
            });

            return NextResponse.json({ message: 'Transferência efetuada com sucesso!', transferencia, log }, { status: 200 });
        } else {
            return NextResponse.json({ message: 'Falha ao transferir patrimônio.' }, { status: 500 });
        }
    } catch (err) {
        console.log(err);
        return NextResponse.json({ message: 'Error', err }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    //
}