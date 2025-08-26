'use client';

export const dynamic = 'force-dynamic';

import PatrimoniosForm from "@/components/forms/patrimoniosForm";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function Inner() {
    const searchParams = useSearchParams();
    const base64Data = searchParams.get('data');
    const [patrimonio, setPatrimonio] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (base64Data) {
            try {
                const decodedData = atob(base64Data as string);

                const parsedData = JSON.parse(decodedData);

                setPatrimonio({
                    tipo: parseInt(parsedData.tipo),
                    descricao: parsedData.descricao,
                    orgao_patrimonio: parsedData.orgao_patrimonio,
                    local: parseInt(parsedData.local),
                });
            } catch (err) {
                console.error("Erro ao decodificar ou parsear o Base64: ", err);
                setPatrimonio(null);
            } finally {
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    }, [base64Data]);

    if (loading) return null;

    return (
        <>
        <PatrimoniosForm item={patrimonio} />
        </>
    );
}

export default function CadastrarPatrimonio() {
    return (
        <Suspense fallback={<div>Carregando...</div>}>
            <Inner />
        </Suspense>
    );
}