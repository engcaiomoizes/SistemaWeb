"use client";

import { redirect, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { FaChevronLeft } from "react-icons/fa";
import LoadingSpinner from "../loading/loadingSpinner";
import { Patrimonio } from "@/types/patrimonio";

interface FormValues {
    tipo: number;
    descricao: string;
    num_patrimonio: number | null;
    orgao_patrimonio: string | null;
    largura: number | null;
    altura: number | null;
    comprimento: number | null;
    raio: number | null;
    diametro: number | null;
    peso: number | null;
    volume: number |null;
    medidas: string | null;
    local: number;
    local_fisico: string | null;
    observacoes: string | null;
    baixado: boolean;
    ativo: boolean;
}

interface Tipo {
    id: number;
    nome: string;
}

interface Local {
    id: number;
    nome: string;
    apelido: string;
    endereco: string;
    telefone_1: string | null;
    telefone_2: string | null;
    email_1: string | null;
    email_2: string | null;
    faixa_ip: string | null;
    ativo: boolean;
}

interface Props {
    id?: number;
    item?: any;
}

export default function PatrimoniosForm({ id, item }: Props) {
    const { push } = useRouter();

    const [formData, setFormData] = useState<FormValues>({
        tipo: 1,
        descricao: '',
        num_patrimonio: null,
        orgao_patrimonio: null,
        largura: null,
        altura: null,
        comprimento: null,
        raio: null,
        diametro: null,
        peso: null,
        volume: null,
        medidas: null,
        local: 1,
        local_fisico: null,
        observacoes: null,
        baixado: false,
        ativo: true,
    });

    const [local, setLocal] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const target = e.target as HTMLInputElement;
            setFormData({ ...formData, [name]: target.checked });
            return;
        }

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const [tipos, setTipos] = useState<Tipo[]>([]);
    const [locais, setLocais] = useState<Local[]>([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchTipos = async () => {
            try {
                const response = await fetch('/api/tipos');
                if (!response.ok) {
                    throw new Error(`Erro ao buscar tipos: ${response.status} - ${response.statusText}`);
                }
                const data = await response.json();
                setTipos(data.response);
                console.log(data.response);
            } catch (err: any) {
                console.log(err.message);
            } finally {
                //
            }
        };
        const fetchLocais = async () => {
            try {
                const response = await fetch('/api/locais');
                if (!response.ok) {
                    throw new Error(`Erro ao buscar locais: ${response.status} - ${response.statusText}`);
                }
                const data = await response.json();
                setLocais(data.response);
                console.log(data.response);
            } catch (err: any) {
                console.log(err.message);
            } finally {
                //
            }
        };

        const loadData = async () => {
            setLoading(true);
            await fetchTipos();
            await fetchLocais();
            setLoading(false);

            if (item) {
                setFormData({
                    ...formData,
                    tipo: item.tipo,
                    descricao: item.descricao,
                    orgao_patrimonio: item.orgao_patrimonio,
                    local: item.local,
                });
            }
        };

        loadData();

        if (id)
            handleLoad();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.num_patrimonio || formData.num_patrimonio <= 0) {
            setMessage("Preencha o número do patrimônio.");
            return;
        }

        try {
            const response = await fetch('/api/patrimonios', {
                method: id ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: id,
                    ...formData
                }),
            });

            console.log(formData);

            const result = await response.json();

            if (response.ok) {
                sessionStorage.setItem("message", result.message);
                push('/patrimonios');
            } else {
                console.log(response);
                console.log('Erro!');
            }
        } catch (err) {
            console.log(err);
        } finally {
            //
        }
    };

    const handleLoad = async () => {
        try {
            const response = await fetch(`/api/patrimonios/${id}`);

            if (!response.ok) {
                throw new Error(`Erro ao buscar patrimônio: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();

            if (data.response) {
                setFormData({
                    tipo: data.response.tipo,
                    descricao: data.response.descricao,
                    num_patrimonio: data.response.num_patrimonio ?? null,
                    orgao_patrimonio: data.response.orgao_patrimonio ?? '',
                    largura: data.response.largura ?? null,
                    altura: data.response.altura ?? null,
                    comprimento: data.response.comprimento ?? null,
                    raio: data.response.raio ?? null,
                    diametro: data.response.diametro ?? null,
                    peso: data.response.peso ?? null,
                    volume: data.response.volume ?? null,
                    medidas: data.response.medidas ?? '',
                    local: data.response.local,
                    local_fisico: data.response.local_fisico ?? '',
                    observacoes: data.response.observacoes ?? '',
                    baixado: data.response.baixado,
                    ativo: data.response.ativo,
                });
                setLocal(data.response.local_fk.nome);
            } else {
                push('/patrimonios');
            }
        } catch (err) {
            console.log(err);
        } finally {
            //
        }
    };

    const [equivalentes, setEquivalentes] = useState<Patrimonio[]>([]);

    const handleVerificaNumero = async () => {
        try {
            const response = await fetch('/api/patrimonios/verifica', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ num: formData.num_patrimonio }),
            });

            if (response.ok) {
                const data = await response.json();
                
                setEquivalentes(data.response);
            }
        } catch (err) {
            console.log(err);
        } finally {
            //
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <>
        <div className="flex justify-center p-10">
            <div className="container">
                <button onClick={() => redirect('/patrimonios')} className="cursor-pointer flex items-center font-medium gap-2 ms-10"><FaChevronLeft /> Voltar</button>
                <form className="max-w-xl mx-auto" method="POST" onSubmit={handleSubmit}>
                    <div className="mb-5">
                        <label htmlFor="tipo" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tipo</label>
                        <select name="tipo" id="tipo" value={formData.tipo} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                            {
                                tipos.map((item) => (
                                    <option key={item.id} value={item.id}>{item.nome}</option>
                                ))
                            }
                        </select>
                    </div>
                    <div className="mb-5">
                        <label htmlFor="descricao" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Descrição</label>
                        <input type="text" name="descricao" id="descricao" value={formData.descricao} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                    </div>
                    <div className="mb-5 flex">
                        <div className="me-4 w-1/3">
                            <label htmlFor="num_patrimonio" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nº Patrimônio</label>
                            <input type="text" name="num_patrimonio" id="num_patrimonio" value={formData.num_patrimonio!} onChange={handleChange} onBlur={handleVerificaNumero} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                        </div>
                        <div className="w-2/3">
                            <label htmlFor="orgao_patrimonio" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Orgão</label>
                            <input type="text" name="orgao_patrimonio" id="orgao_patrimonio" value={formData.orgao_patrimonio!} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                        </div>
                    </div>
                    <div className="mb-5 flex">
                        <div className="me-4 w-1/3">
                            <label htmlFor="largura" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Largura</label>
                            <input type="text" name="largura" id="largura" value={formData.largura!} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                        </div>
                        <div className="me-4 w-1/3">
                            <label htmlFor="altura" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Altura</label>
                            <input type="text" name="altura" id="altura" value={formData.altura!} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                        </div>
                        <div className="w-1/3">
                            <label htmlFor="comprimento" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Comprimento</label>
                            <input type="text" name="comprimento" id="comprimento" value={formData.comprimento!} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                        </div>
                    </div>
                    <div className="mb-5 flex">
                        <div className="me-4 w-1/4">
                            <label htmlFor="raio" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Raio</label>
                            <input type="text" name="raio" id="raio" value={formData.raio!} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                        </div>
                        <div className="me-4 w-1/4">
                            <label htmlFor="diametro" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Diâmetro</label>
                            <input type="text" name="diametro" id="diametro" value={formData.diametro!} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                        </div>
                        <div className="me-4 w-1/4">
                            <label htmlFor="peso" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Peso</label>
                            <input type="text" name="peso" id="peso" value={formData.peso!} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                        </div>
                        <div className="w-1/4">
                            <label htmlFor="volume" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Volume</label>
                            <input type="text" name="volume" id="volume" value={formData.volume!} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                        </div>
                    </div>
                    <div className="mb-5">
                        <label htmlFor="local" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Local</label>
                        {
                            id ?
                            <span>{local}</span>
                            :
                            <select name="local" id="local" value={formData.local} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                {
                                    locais.map((item) => (
                                        <option key={item.id} value={item.id}>{item.nome}</option>
                                    ))
                                }
                            </select>
                        }
                    </div>
                    <div className="mb-5">
                        <label htmlFor="local_fisico" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Local Físico</label>
                        <input type="text" name="local_fisico" id="local_fisico" value={formData.local_fisico!} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="observacoes" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Observações</label>
                        <input type="text" name="observacoes" id="observacoes" value={formData.observacoes!} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                    </div>
                    {
                        !formData.baixado &&
                        <div className="mb-5">
                            <label className="inline-flex items-center cursor-pointer">
                                <input type="checkbox" name="ativo" id="ativo" checked={formData.ativo} onChange={handleChange} className="sr-only peer" />
                                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                                <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Ativo?</span>
                            </label>
                        </div>
                    }
                    <button type="submit" className="cursor-pointer text-white bg-blue-600 hover:bg-blue-700 focus:outline-none font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">{ id ? 'Atualizar' : 'Cadastrar' }</button>
                </form>
                <div className="p-2 max-w-xl mx-auto mt-6 flex flex-col">
                    <span className="text-sm text-red-600 font-bold">{message}</span>
                    {
                        equivalentes.length > 0 &&
                        <span className="text-orange-600 font-medium mb-1">Já existe(m) patrimônio(s) com este número cadastrado(s):</span>
                    }
                    {
                        equivalentes.map((item, index) => (
                            <span key={index}>{item.num_patrimonio} {item.orgao_patrimonio} | {item.tipo_fk.nome} {item.descricao}</span>
                        ))
                    }
                </div>
            </div>
        </div>
        </>
    );
}