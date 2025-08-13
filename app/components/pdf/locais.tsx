import { PDFRef } from "@/lib/extras";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";

interface Props {
    isGenerated: () => void;
}

interface Local {
    nome: string;
    apelido: string;
    endereco: string;
    telefone1: string;
    telefone2: string;
    email1: string;
    email2: string;
    faixa_ip: string;
    ativo: boolean;
}

const LocaisPDF = forwardRef<PDFRef, Props>((props, ref) => {
    const [locais, setLocais] = useState<Local[]>([]);
    const [count, setCount] = useState(0);

    const pdfRef = useRef<HTMLDivElement>(null);

    const handleLoad = useCallback(async () => {
        try {
            const response = await fetch(`/api/locais`);

            const data = await response.json();

            setLocais(data.response);
            setCount(data.count);
        } catch (err) {
            console.error(err);
        }
    }, []);

    useEffect(() => {
        handleLoad();
    }, [handleLoad]);

    const generatePDF = async () => {
        const htmlContent = pdfRef.current?.outerHTML;

        try {
            const response = await fetch('/api/generate-pdf', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ html: htmlContent, title: 'Listagem de Locais' }),
            });

            if (response.ok) {
                const blob = await response.blob();

                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                //a.download = `teste.pdf`;
                a.target = '_blank';

                document.body.appendChild(a);
                a.click();

                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            } else {
                console.error('Erro ao gerar PDF: ', response.status);
            }

            props.isGenerated();
        } catch (err) {
            console.error('Erro ao gerar PDF: ', err);
        }
    };

    useImperativeHandle(ref, () => ({
        gerarListagem: generatePDF,
    }));

    return (
        <>
        <div className="hidden">
            <div className="bg-transparent relative w-[793px] h-auto" ref={pdfRef}>
                <div className="flex justify-center">
                    <span className="uppercase mb-4 text-sm font-bold">Listagem de Locais</span>
                </div>
                <table className="w-full">
                    <thead>
                        <tr>
                            <th className="text-xs border border-black px-1 text-left">Nome</th>
                            <th className="text-xs border border-black px-1 text-left">Endereço</th>
                            <th className="text-xs border border-black px-1 text-left">Telefone</th>
                            <th className="text-xs border border-black px-1 text-left">E-mail</th>
                            <th className="text-xs border border-black px-1 text-left">Faixa IP</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            locais.length > 0 &&
                            locais.map((item, index) => (
                                <tr key={index}>
                                    <td className="text-[11px] border border-black px-1">{item.nome}</td>
                                    <td className="text-[11px] border border-black px-1">{item.endereco}</td>
                                    <td className="text-[11px] border border-black px-1">{item.telefone1}</td>
                                    <td className="text-[11px] border border-black px-1">{item.email1}</td>
                                    <td className="text-[11px] border border-black px-1">{item.faixa_ip}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
        </>
    );
});

LocaisPDF.displayName = "LocaisPDF";

export default LocaisPDF;