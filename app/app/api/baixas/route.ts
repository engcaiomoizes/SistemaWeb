import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const response = await prisma.baixas.findMany({
            include: {
                itens: {
                    include: {
                        patrimonio_fk: {
                            include: {
                                tipo_fk: true,
                            },
                        },
                    },
                },
            },
        });

        return NextResponse.json({ response }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ message: 'Error', err }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const data = await req.json();

    // console.log(data);

    try {
        // Cria a Baixa
        const response = await prisma.baixas.create({
            data: {
                laudoId: data.laudoId,
                memorando: data.memorando,
                observacoes: data.observacoes,
            },
        });

        console.log(response);

        // Cria o array de Itens com a lista de IDs recebidos (patrimoniosId)
        const itens = data.patrimoniosId.map((item: string) => ({
            baixaId: response.id,
            patrimonioId: item,
        }));

        // Cadastra os itens da baixa
        const item = await prisma.itens.createMany({
            data: itens,
        });

        // Atualiza o estado dos patrimônios
        const update = await prisma.patrimonios.updateMany({
            where: {
                id: { in: data.patrimoniosId },
            },
            data: {
                baixado: true,
                ativo: false,
            },
        });

        const session = await getServerSession(authOptions);

        const log = await prisma.logs.create({
            data: {
                usuario: session?.user.id,
                descricao: `Registro de Baixa${data.memorando ? ` do ${data.memorando}` : ''}`,
                // detalhes: `Patrimônios baixados: ${data.patrimoniosId.join(' - ')}`,
            },
        });

        // await prisma.patrimonios.update({
        //     where: {
        //         id: id,
        //     },
        //     data: {
        //         baixado: true,
        //         ativo: false,
        //     },
        // });

        // const session = await getServerSession(authOptions);
        
        // const log = await prisma.logs.create({
        //     data: {
        //         usuario: session?.user.id,
        //         descricao: `Patrimônio ${response.patrimonio_fk.num_patrimonio} ${response.patrimonio_fk.orgao_patrimonio} foi Baixado${response.justificativa ? ` por ${response.justificativa}` : '.'}`,
        //     },
        // });

        return NextResponse.json({ message: 'Baixa cadastrada com sucesso!', response, item, update, log }, { status: 200 });
    } catch (err) {
        console.log(err);
        return NextResponse.json({ message: 'Error', err }, { status: 500 });
    }
}