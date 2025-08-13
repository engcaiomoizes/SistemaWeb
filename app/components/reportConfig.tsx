import { useCallback, useEffect, useState } from "react";
import MultiSelect from "./multiSelect";
import { PDFDownloadLink } from "@react-pdf/renderer";
import MyDocument from "./patrimoniosPdf";

interface Option {
    value: number;
    label: string;
}

export default function ReportConfig(props: any) {
    const [patrimonios, setPatrimonios] = useState<any[]>([]);
    const [count, setCount] = useState(0);
    
    const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
    const [selectedLocais, setSelectedLocais] = useState<Option[]>([]);

    const [options, setOptions] = useState<Option[]>([]);
    const [locais, setLocais] = useState<Option[]>([]);

    const handleLoad = useCallback(async () => {
        try {
            const arrOptions = selectedOptions.map(item => `${encodeURIComponent(item.value)}`).join(',');
            const arrLocais = selectedLocais.map(item => `${encodeURIComponent(item.value)}`).join(',');

            const response = await fetch(
                `/api/patrimonios?${arrOptions ? `&options=${arrOptions}` : ''}${arrLocais ? `&locais=${arrLocais}` : ''}`
            );
            if (!response.ok) {
                throw new Error(`Erro ao buscar patrimônios: ${response.status} - ${response.statusText}`);
            }
            const data = await response.json();
            setPatrimonios(data.response);
            setCount(data.count);
            console.log(data);
        } catch (err: any) {
            console.log(err.message);
        } finally {
            //
        }
    }, [count, selectedOptions, selectedLocais]);

    const handleTipos = async () => {
        try {
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
        }
    };

    const handleLocais = async () => {
        try {
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
        }
    };

    useEffect(() => {
        handleLoad();
        handleLocais();
        handleTipos();
    }, [count, handleLoad, selectedOptions, selectedLocais]);

    const handleChange = (selected: any) => {
        setSelectedOptions(selected);
        setGerar(false);
    };

    const handleChangeLocais = (selected: any) => {
        setSelectedLocais(selected);
        setGerar(false);
    };

    const [gerar, setGerar] = useState(false);
    const [pdfKey, setPdfKey] = useState(0);

    const handleGerar = () => {
        setGerar(true);
        setPdfKey(prevKey => prevKey + 1);
        //handleLoad();
        console.log(patrimonios);
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
                    <button onClick={handleGerar} className="justify-self-end text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-semibold rounded-lg text-xs uppercase px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Gerar relatório</button>
                    {
                        gerar &&
                        <PDFDownloadLink key={pdfKey} document={<MyDocument data={patrimonios} />} fileName="patrimonios.pdf">
                            {({ blob, url, loading, error }) =>
                            loading ? <button disabled className="justify-self-end text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-semibold rounded-lg text-xs uppercase px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Gerando relatório...</button> : <button className="justify-self-end text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-semibold rounded-lg text-xs uppercase px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Baixar relatório</button>
                            }
                        </PDFDownloadLink>
                    }
                </div>
            </div>
        </div>
        </>
    );
}