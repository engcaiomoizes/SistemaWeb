import { PDFRef } from "@/lib/extras";
import { forwardRef, useImperativeHandle, useRef } from "react";

interface Props {
    isGenerated: () => void;
    ramais: Ramal[];
}

interface Ramal {
    numero: string;
    nome: string;
    setor: string | null;
}

const FolhaRamal = forwardRef<PDFRef, Props>((props, ref) => {
    const pdfRef = useRef<HTMLDivElement>(null);

    const dadosOrdenados = [...props.ramais].sort((a, b) => {
        const numeroA = a?.numero;
        const numeroB = b?.numero;

        return numeroA.localeCompare(numeroB);
    }).sort((a, b) => {
        const departamentoA = a.setor?.toLowerCase();
        const departamentoB = b.setor?.toLowerCase();

        return departamentoA!.localeCompare(departamentoB!);
    });

    const generatePDF = async () => {
        const htmlContent = pdfRef.current?.outerHTML;

        try {
            const response = await fetch('/api/generate-pdf', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ html: htmlContent, title: 'Listagem de Ramais' }),
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
            <div className="bg-transparent relative w-[793px] px-4 h-auto flex space-x-2" ref={pdfRef}>
                <table className="w-2/5">
                    <thead>
                        <tr>
                            <th colSpan={3} className="text-sm border border-black px-1 text-center uppercase">Secretaria de Assistência Social e Participação Cidadã - (18) 3636-1260</th>
                        </tr>
                        <tr>
                            <th colSpan={3} className="text-sm border border-black px-1 text-center uppercase">Rua Bandeirantes, 111, Centro / CEP: 16010-090</th>
                        </tr>
                        <tr>
                            <th className="text-sm border border-black px-1 text-left">Nome</th>
                            <th className="text-sm border border-black px-1 text-left">Depto.</th>
                            <th className="text-sm border border-black px-1 text-left">Ramal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            dadosOrdenados.length > 0 &&
                            dadosOrdenados.map((item, index) => (
                                <tr key={index}>
                                    <td className="uppercase text-sm border border-black px-1">{item.nome}</td>
                                    <td className="uppercase text-sm border border-black px-1">{item.setor}</td>
                                    <td className="uppercase text-sm border border-black px-1">{item.numero}</td>
                                </tr>
                            ))
                        }
                        <tr>
                            <th colSpan={3} className="text-xs border border-black px-1 text-center uppercase">Transferência de Ramal: *2 + Ramal</th>
                        </tr>
                        <tr>
                            <th colSpan={3} className="text-xs border border-black px-1 text-center uppercase">Retorno de Ligação: ** + Ramal</th>
                        </tr>
                    </tbody>
                </table>
                <table className="w-2/5">
                    <thead>
                        <tr>
                            <th colSpan={3} className="text-sm border border-black px-1 text-center uppercase">Secretaria de Assistência Social e Participação Cidadã - (18) 3636-1260</th>
                        </tr>
                        <tr>
                            <th colSpan={3} className="text-sm border border-black px-1 text-center uppercase">Rua Bandeirantes, 111, Centro / CEP: 16010-090</th>
                        </tr>
                        <tr>
                            <th className="text-sm border border-black px-1 text-left">Nome</th>
                            <th className="text-sm border border-black px-1 text-left">Depto.</th>
                            <th className="text-sm border border-black px-1 text-left">Ramal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            dadosOrdenados.length > 0 &&
                            dadosOrdenados.map((item, index) => (
                                <tr key={index}>
                                    <td className="uppercase text-sm border border-black px-1">{item.nome}</td>
                                    <td className="uppercase text-sm border border-black px-1">{item.setor}</td>
                                    <td className="uppercase text-sm border border-black px-1">{item.numero}</td>
                                </tr>
                            ))
                        }
                        <tr>
                            <th colSpan={3} className="text-xs border border-black px-1 text-center uppercase">Transferência de Ramal: *2 + Ramal</th>
                        </tr>
                        <tr>
                            <th colSpan={3} className="text-xs border border-black px-1 text-center uppercase">Retorno de Ligação: ** + Ramal</th>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        </>
    );
});

FolhaRamal.displayName = "FolhaRamal";

export default FolhaRamal;