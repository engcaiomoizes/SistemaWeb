"use client";

import { redirect, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { FaChevronLeft } from "react-icons/fa";
import LoadingSpinner from "../loading/loadingSpinner";

interface FormValues {
    nome: string;
    cadastrar_usuarios: boolean;
    cadastrar_locais: boolean;
    cadastrar_niveis: boolean;
    cadastrar_patrimonios: boolean;
    cadastrar_tipos: boolean;
    cadastrar_ramais: boolean;
    cadastrar_updates: boolean;
    cadastrar_funcionarios: boolean;
    cadastrar_feriados: boolean;
}

export default function NiveisForm(props: any) {
    const { push } = useRouter();

    const [loading, setLoading] = useState<boolean>(false);

    const [formData, setFormData] = useState<FormValues>({
        nome: '',
        cadastrar_usuarios: false,
        cadastrar_locais: false,
        cadastrar_niveis: false,
        cadastrar_patrimonios: false,
        cadastrar_tipos: false,
        cadastrar_ramais: false,
        cadastrar_updates: false,
        cadastrar_funcionarios: false,
        cadastrar_feriados: false,
    });

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

    useEffect(() => {
        if (props.id)
            handleLoad();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/niveis', {
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
                push('/niveis');
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
            setLoading(true);

            const response = await fetch(`/api/niveis/${props.id}`);

            if (!response.ok) {
                throw new Error(`Erro ao buscar tipo: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();

            if (data.response) {
                setFormData({
                    nome: data.response.nome,
                    cadastrar_usuarios: data.response.cadastrar_usuarios,
                    cadastrar_locais: data.response.cadastrar_locais,
                    cadastrar_niveis: data.response.cadastrar_niveis,
                    cadastrar_patrimonios: data.response.cadastrar_patrimonios,
                    cadastrar_tipos: data.response.cadastrar_tipos,
                    cadastrar_ramais: data.response.cadastrar_ramais,
                    cadastrar_updates: data.response.cadastrar_updates,
                    cadastrar_funcionarios: data.response.cadastrar_funcionarios,
                    cadastrar_feriados: data.response.cadastrar_feriados,
                })
            } else {
                push('/niveis');
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <>
        <div className="flex justify-center p-10">
            <div className="container">
                <button onClick={() => redirect('/niveis')} className="cursor-pointer flex items-center font-medium gap-2 ms-10"><FaChevronLeft /> Voltar</button>
                <form className="max-w-xl mx-auto" method="POST" onSubmit={handleSubmit}>
                    <div className="mb-5">
                        <label htmlFor="nome" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nome</label>
                        <input type="text" name="nome" id="nome" value={formData.nome} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                    </div>
                    <div className="flex flex-wrap space-x-6 justify-between mb-5">
                        <label className="inline-flex items-center mb-5 cursor-pointer">
                            <input type="checkbox" name="cadastrar_usuarios" id="cadastrar_usuarios" checked={formData.cadastrar_usuarios} onChange={handleChange} className="sr-only peer" />
                            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                            <span className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Cadastrar usuários</span>
                        </label>
                        <label className="inline-flex items-center mb-5 cursor-pointer">
                            <input type="checkbox" name="cadastrar_locais" id="cadastrar_locais" checked={formData.cadastrar_locais} onChange={handleChange} className="sr-only peer" />
                            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                            <span className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Cadastrar locais</span>
                        </label>
                        <label className="inline-flex items-center mb-5 cursor-pointer">
                            <input type="checkbox" name="cadastrar_niveis" id="cadastrar_niveis" checked={formData.cadastrar_niveis} onChange={handleChange} className="sr-only peer" />
                            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                            <span className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Cadastrar níveis</span>
                        </label>
                        <label className="inline-flex items-center mb-5 cursor-pointer">
                            <input type="checkbox"name="cadastrar_patrimonios" id="cadastrar_patrimonios" checked={formData.cadastrar_patrimonios} onChange={handleChange} className="sr-only peer" />
                            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                            <span className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Cadastrar patrimônios</span>
                        </label>
                        <label className="inline-flex items-center mb-5 cursor-pointer">
                            <input type="checkbox" name="cadastrar_tipos" id="cadastrar_tipos" checked={formData.cadastrar_tipos} onChange={handleChange} className="sr-only peer" />
                            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                            <span className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Cadastrar tipos</span>
                        </label>
                        <label className="inline-flex items-center mb-5 cursor-pointer">
                            <input type="checkbox" name="cadastrar_ramais" id="cadastrar_ramais" checked={formData.cadastrar_ramais} onChange={handleChange} className="sr-only peer" />
                            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                            <span className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Cadastrar ramais</span>
                        </label>
                        <label className="inline-flex items-center mb-5 cursor-pointer">
                            <input type="checkbox" name="cadastrar_updates" id="cadastrar_updates" checked={formData.cadastrar_updates} onChange={handleChange} className="sr-only peer" />
                            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                            <span className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Cadastrar updates</span>
                        </label>
                        <label className="inline-flex items-center mb-5 cursor-pointer">
                            <input type="checkbox" name="cadastrar_funcionarios" id="cadastrar_funcionarios" checked={formData.cadastrar_funcionarios} onChange={handleChange} className="sr-only peer" />
                            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                            <span className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Cadastrar funcionários</span>
                        </label>
                        <label className="inline-flex items-center mb-5 cursor-pointer">
                            <input type="checkbox" name="cadastrar_feriados" id="cadastrar_feriados" checked={formData.cadastrar_feriados} onChange={handleChange} className="sr-only peer" />
                            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                            <span className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Cadastrar feriados</span>
                        </label>
                    </div>
                    <button type="submit" className="cursor-pointer text-white bg-blue-600 hover:bg-blue-700 focus:outline-none font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">{ props.id ? 'Atualizar' : 'Cadastrar' }</button>
                </form>
            </div>
        </div>
        </>
    );
}