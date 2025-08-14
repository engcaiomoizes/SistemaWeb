import { useCallback, useEffect, useState } from "react";
import MultiSelect from "./multiSelect";
import { PDFDownloadLink } from "@react-pdf/renderer";
import MyDocument from "./patrimoniosPdf";
import { Loader2 } from "lucide-react";

interface Option {
    value: number;
    label: string;
}

export default function ReportConfig(props: any) {
    const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
    const [selectedLocais, setSelectedLocais] = useState<Option[]>([]);

    const [options, setOptions] = useState<Option[]>([]);
    const [locais, setLocais] = useState<Option[]>([]);

    const [gerando, setGerando] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleTipos = async () => {
        try {
            setLoading(true);

            const response = await fetch(`/api/tipos`);

            const data = await response.json();

            if (response.ok) {
                const tipos: Option[] = [];
                data.response.forEach((tipo: { id: number; nome: string; }) => {
                    tipos.push({
                        value: tipo.id,
                        label: tipo.nome,
                    });
                });
                setOptions(tipos);
            }
        } catch (err) {
            //
        } finally {
            setLoading(false);
        }
    };

    const handleLocais = async () => {
        try {
            setLoading(true);

            const response = await fetch(`/api/locais`);

            const data = await response.json();

            if (response.ok) {
                const locais: Option[] = [];
                data.response.forEach((tipo: { id: number; nome: string; }) => {
                    locais.push({
                        value: tipo.id,
                        label: tipo.nome,
                    });
                });
                setLocais(locais);
            }
        } catch (err) {
            //
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleLocais();
        handleTipos();
    }, []);

    const handleChange = (selected: any) => {
        setSelectedOptions(selected);
    };

    const handleChangeLocais = (selected: any) => {
        setSelectedLocais(selected);
    };

    const handleGerar = async () => {
        const tipos_ids = selectedOptions.map(tipo => tipo.value);
        const locais_ids = selectedLocais.map(local => local.value);

        try {
            setGerando(true);

            const response = await fetch (`${process.env.NEXT_PUBLIC_PYTHON_API_URL}/relatorio-patrimonios`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    tipos: tipos_ids,
                    locais: locais_ids,
                }),
            });

            if (!response.ok) {
                throw new Error("Ocorreu um erro inesperado.");
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.target = '_blank';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error(err);
        } finally {
            setGerando(false);
        }
    };

    return (
        <>
        <div className={`${props.view ? '' : 'hidden'} fixed top-0 left-0 z-50`}>
            <div className="fixed bg-black opacity-40 w-full h-full" onClick={props.fechar}></div>
            <div className="fixed bg-gray-800 shadow-lg p-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg max-h-[640px] min-w-96 w-[520px]">
                <button className="absolute top-2 right-2" onClick={props.fechar}>
                    <svg className="w-6 h-6 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 17.94 6M18 18 6.06 6"/>
                    </svg>
                </button>
                <div className="flex flex-col justify-center items-center space-y-4 text-white">
                    <MultiSelect msStyle={'w-full text-gray-800'} placeholder="Selecione o tipo..." options={options} selectedOptions={selectedOptions} onChange={handleChange} />
                    <MultiSelect msStyle={'w-full text-gray-800'} placeholder="Selecione o local..." options={locais} selectedOptions={selectedLocais} onChange={handleChangeLocais} />
                    <button onClick={handleGerar} className="justify-self-end text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-semibold rounded-lg text-xs uppercase px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                        {
                            gerando ?
                            <Loader2 className="h-5 w-5 animate-spin" />
                            :
                            'Gerar relatório'
                        }
                    </button>
                </div>
            </div>
        </div>
        </>
    );
}