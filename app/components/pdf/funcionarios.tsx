import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";

interface Funcionario {
    nome: string;
    rg: string;
    matricula: string;
    cargo: string;
    local_fk: Local;
}

interface Local {
    nome: string;
    apelido: string;
}

interface Props {
    local: number | null;
}

export interface PDFRef {
    gerarListagem: () => void;
}

const FuncionariosPDF = forwardRef<PDFRef, Props>((props, ref) => {
    const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
    const [count, setCount] = useState(0);

    const pdfRef = useRef<HTMLDivElement>(null);

    const handleLoad = useCallback(async () => {
        try {
            const response = await fetch(`/api/funcionarios`);

            const data = await response.json();

            setFuncionarios(data.response);
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
                body: JSON.stringify({ html: htmlContent }),
            });

            if (response.ok) {
                const blob = await response.blob();

                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `teste.pdf`;

                document.body.appendChild(a);
                a.click();

                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            } else {
                console.error('Erro ao gerar PDF: ', response.status);
            }
        } catch (err) {
            console.error('Erro ao gerar PDF: ', err);
        }
    };

    useImperativeHandle(ref, () => ({
        gerarListagem: generatePDF,
    }));

    return (
        <>
        {/* {count}
        {JSON.stringify(funcionarios)} */}
        <div className="hidden">
            <div className="bg-transparent relative w-[793px] h-auto" ref={pdfRef}>
                <div className="flex justify-center">
                    <span className="uppercase mb-4 text-sm font-bold">Listagem de Funcionários</span>
                </div>
                <table className="w-full">
                    <thead>
                        <tr>
                            <th className="text-xs border border-black px-1 text-left">Nome</th>
                            <th className="text-xs border border-black px-1 text-left">RG</th>
                            <th className="text-xs border border-black px-1 text-left">Matrícula</th>
                            <th className="text-xs border border-black px-1 text-left">Cargo/Função</th>
                            <th className="text-xs border border-black px-1 text-left">Sede de serviço</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            funcionarios.length > 0 &&
                            funcionarios.map((item, index) => (
                                <tr key={index}>
                                    <td className="text-[11px] border border-black px-1">{item.nome}</td>
                                    <td className="text-[11px] border border-black px-1">{item.rg}</td>
                                    <td className="text-[11px] border border-black px-1">{item.matricula}</td>
                                    <td className="text-[11px] border border-black px-1">{item.cargo}</td>
                                    <td className="text-[11px] border border-black px-1">{item.local_fk?.apelido ? item.local_fk?.apelido : item.local_fk?.nome}</td>
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

FuncionariosPDF.displayName = "FuncionariosPDF";

export default FuncionariosPDF;
