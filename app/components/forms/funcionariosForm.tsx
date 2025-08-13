"use client";

import { redirect, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import LoadingSpinner from "../loading/loadingSpinner";
import { FaChevronLeft } from "react-icons/fa";

interface FormValues {
    nome: string;
    rg: string;
    matricula: string;
    cargo: string;
    local: string;
    local_fisico: string;
    observacoes: string;
}

interface Local {
    id: string;
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

export default function FuncionariosForm(props: any) {
    const { push } = useRouter();

    const [loading, setLoading] = useState<boolean>(true);

    const [formData, setFormData] = useState<FormValues>({
        nome: '',
        rg: '',
        matricula: '',
        cargo: '',
        local: '',
        local_fisico: '',
        observacoes: '',
    });

    const [locais, setLocais] = useState<Local[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleLoadLocais = async () => {
        try {
            const response = await fetch(`/api/locais`);

            if (!response.ok) {
                throw new Error(`Erro ao buscar locais: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();

            if (data.response) {
                setLocais(data.response);
                setFormData({ ...formData, local: data.response[0].id });
            } else {
                //
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const handleLoad = async () => {
        try {
            setLoading(true);

            const response = await fetch(`/api/funcionarios/${props.id}`);

            if (!response.ok) {
                throw new Error(`Erro ao buscar funcionário: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();

            if (data.response) {
                setFormData({
                    nome: data.response.nome,
                    rg: data.response.rg,
                    matricula: data.response.matricula,
                    cargo: data.response.cargo,
                    local: data.response.local,
                    local_fisico: data.response.local_fisico,
                    observacoes: data.response.observacoes,
                });
            } else {
                push('/funcionarios');
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            await handleLoadLocais();
            if (props.id)
                await handleLoad();
        };

        loadData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/funcionarios', {
                method: props.id ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: props.id,
                    ...formData
                }),
            });

            console.log(formData);

            const result = await response.json();

            if (response.ok) {
                sessionStorage.setItem("message", result.message);
                push('/funcionarios');
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

    if (loading) return <LoadingSpinner />;

    return (
        <>
        <div className="flex justify-center p-10">
            <div className="container">
                <button onClick={() => redirect('/funcionarios')} className="cursor-pointer flex items-center font-medium gap-2 ms-10"><FaChevronLeft /> Voltar</button>
                <form className="max-w-xl mx-auto" method="POST" onSubmit={handleSubmit}>
                    <div className="mb-5">
                        <label htmlFor="nome" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nome</label>
                        <input type="text" name="nome" id="nome" value={formData.nome} onChange={handleChange} className="uppercase bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                    </div>
                    <div className="mb-5 flex">
                        <div className="me-4 w-1/2">
                            <label htmlFor="rg" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">RG</label>
                            <input type="text" name="rg" id="rg" value={formData.rg} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                        </div>
                        <div className="w-1/2">
                            <label htmlFor="matricula" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Matrícula</label>
                            <input type="text" name="matricula" id="matricula" value={formData.matricula} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                        </div>
                    </div>
                    <div className="mb-5">
                        <label htmlFor="cargo" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Cargo</label>
                        <input type="text" name="cargo" id="cargo" value={formData.cargo} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                    </div>
                    <div className="mb-5">
                    <label htmlFor="local" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Sede de serviço</label>
                        <select name="local" id="local" value={formData.local} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                            {
                                locais.map((item) => (
                                    <option key={item.id} value={item.id}>{item.nome}</option>
                                ))
                            }
                        </select>
                    </div>
                    <div className="mb-5">
                        <label htmlFor="local_fisico" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Local Físico</label>
                        <input type="text" name="local_fisico" id="local_fisico" value={formData.local_fisico} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="observacoes" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Observações</label>
                        <input type="text" name="observacoes" id="observacoes" value={formData.observacoes} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                    </div>
                    <button type="submit" className="cursor-pointer text-white bg-blue-600 hover:bg-blue-700 focus:outline-none font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">{ props.id ? 'Atualizar' : 'Cadastrar' }</button>
                </form>
            </div>
        </div>
        </>
    );
}