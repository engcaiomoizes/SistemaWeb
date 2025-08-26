'use client';

import { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import Loading from "../loading/loading";
import { Baixa } from "@/types/baixas";
import Combobox from "../searchSelect";
import { buildStringDate } from "@/lib/string";

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

interface Option {
    value: string;
    label: string;
}

export default function Baixas({ isOpen, onClose }: Props) {
    const [loading, setLoading] = useState<boolean>(false);
    const [baixas, setBaixas] = useState<Baixa[]>([]);
    const [options, setOptions] = useState<Option[]>([]);
    const [selectedOption, setSelectedOption] = useState<Option>();

    const baixaSelecionada = baixas.filter(baixa => baixa.id == selectedOption?.value);

    useEffect(() => {
        const handleLoad = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/baixas');

                if (response.ok) {
                    const data = await response.json();
                    
                    const optionsData = data.response.map((item: Baixa) => ({
                        label: `${item.memorando} - ${buildStringDate(item.created_at)}`,
                        value: item.id,
                    }));

                    setBaixas(data.response);
                    setOptions(optionsData);
                } else {
                    //
                }
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        }
        
        if (isOpen)
            handleLoad();
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="absolute top-0 left-0">
            <div className="fixed top-0 left-0 z-20">
                <div className="fixed top-0 left-0 bg-black opacity-40 w-full h-full" onClick={onClose}></div>
                <div className="fixed bg-white dark:bg-gray-800 px-6 pt-4 pb-6 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg max-h-[640px] min-w-96 shadow-lg">
                    <button className="cursor-pointer absolute top-2 right-2" onClick={onClose}>
                        <MdClose className="size-6" />
                    </button>
                    {
                        loading ?
                        <Loading />
                        :
                        <>
                        <div className="flex flex-col items-center">
                            <span className="text-xl font-bold uppercase mb-4">Lista de Baixas Patrimoniais</span>
                            <Combobox msStyle="w-full" options={options} onChange={(selected: any) => setSelectedOption(selected)} selectedOption={selectedOption} placeholder="Procure uma Baixa..." />
                            {
                                baixaSelecionada.length > 0 &&
                                <div className="w-full flex flex-col mt-3">
                                    <span className="font-medium text-xl mb-1">{baixaSelecionada[0].memorando}</span>
                                    <span className=""><b>Data:</b> {buildStringDate(baixaSelecionada[0].created_at)}</span>
                                    {
                                        baixaSelecionada[0].observacoes &&
                                        <span className="text-sm"><b>Obs.:</b> {baixaSelecionada[0].observacoes}</span>
                                    }
                                    <div className="flex flex-col">
                                        <span className="font-bold">Itens:</span>
                                        {
                                            baixaSelecionada[0].itens.length > 0 &&
                                            baixaSelecionada[0].itens.map((item, index) => (
                                                <span key={index}>{item.patrimonio_fk.tipo_fk.nome} {item.patrimonio_fk.descricao} | {item.patrimonio_fk.num_patrimonio} {item.patrimonio_fk.orgao_patrimonio}</span>
                                            ))
                                        }
                                    </div>
                                    {
                                        baixaSelecionada[0].laudo &&
                                        <div className="flex">
                                            <a href={`${process.env.NEXT_PUBLIC_PYTHON_API_URL}/static/laudos/${baixaSelecionada[0].laudo}`} target="_blank" className="text-blue-600 font-medium hover:underline">Visualizar Laudo Técnico</a>
                                        </div>
                                    }
                                </div>
                            }
                        </div>
                        </>
                    }
                </div>
            </div>
        </div>
    );
}