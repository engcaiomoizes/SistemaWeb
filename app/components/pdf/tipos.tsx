import { PDFRef } from "@/lib/extras";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";

interface Props {
    isGenerated: () => void;
}

interface Tipo {
    nome: string;
}

const TiposPDF = forwardRef<PDFRef, Props>((props, ref) => {
    const [tipos, setTipos] = useState<Tipo[]>([]);
    const [count, setCount] = useState(0);

    const pdfRef = useRef<HTMLDivElement>(null);

    const handleLoad = useCallback(async () => {
        try {
            const response = await fetch(`/api/tipos`);

            const data = await response.json();

            setTipos(data.response);
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
                body: JSON.stringify({ html: htmlContent, title: 'Listagem de Tipos' }),
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
                    <span className="uppercase mb-4 text-sm font-bold">Listagem de Tipos</span>
                </div>
                <table className="w-full">
                    <thead>
                        <tr>
                            <th className="text-xs border border-black px-1 text-left">Nome</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            tipos.length > 0 &&
                            tipos.map((item, index) => (
                                <tr key={index}>
                                    <td className="text-[11px] border border-black px-1">{item.nome}</td>
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

TiposPDF.displayName = "TiposPDF";

export default TiposPDF;