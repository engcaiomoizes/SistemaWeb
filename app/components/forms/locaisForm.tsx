"use client";

import { InputMask } from "@react-input/mask";
import { redirect, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { FaChevronLeft } from "react-icons/fa";
import LoadingSpinner from "../loading/loadingSpinner";

interface FormValues {
    nome: string;
    apelido: string | null;
    endereco: string;
    telefone_1: string | null;
    telefone_2: string | null;
    email_1: string | null;
    email_2: string | null;
    faixa_ip: string | null;
    ativo: boolean;
}

const telMask = {
    mask: '(__) ____-____',
    replacement: { _: /\d/ },
};

export default function LocaisForm(props: any) {
    const { push } = useRouter();

    const [loading, setLoading] = useState<boolean>(false);

    const [formData, setFormData] = useState<FormValues>({
        nome: '',
        apelido: null,
        endereco: '',
        telefone_1: null,
        telefone_2: null,
        email_1: null,
        email_2: null,
        faixa_ip: null,
        ativo: true,
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
            const response = await fetch('/api/locais', {
                method: props.id ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: Number(props.id),
                    ...formData
                }),
            });

            const result = await response.json();

            if (response.ok) {
                sessionStorage.setItem("message", result.message);
                push('/locais');
            } else {
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

            const response = await fetch(`/api/locais/${props.id}`);

            if (!response.ok) {
                throw new Error(`Erro ao buscar local: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();

            if (data.response) {
                setFormData({
                    nome: data.response.nome,
                    apelido: data.response.apelido,
                    endereco: data.response.endereco,
                    telefone_1: data.response.telefone_1,
                    telefone_2: data.response.telefone_2,
                    email_1: data.response.email_1,
                    email_2: data.response.email_2,
                    faixa_ip: data.response.faixa_ip,
                    ativo: data.response.ativo
                })
            } else {
                push('/locais');
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
                <button onClick={() => redirect('/locais')} className="cursor-pointer flex items-center font-medium gap-2 ms-10"><FaChevronLeft /> Voltar</button>
                <form className="max-w-xl mx-auto" method="POST" onSubmit={handleSubmit}>
                    <div className="mb-5 flex">
                        <div className="me-4 w-3/4">
                            <label htmlFor="nome" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nome</label>
                            <input type="text" name="nome" id="nome" value={formData.nome} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                        </div>
                        <div className="w-1/4">
                            <label htmlFor="apelido" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Apelido</label>
                            <input type="text" name="apelido" id="apelido" value={formData.apelido!} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                        </div>
                    </div>
                    <div className="mb-5">
                        <label htmlFor="endereco" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Endereço</label>
                        <input type="text" name="endereco" id="endereco" value={formData.endereco} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                    </div>
                    <div className="mb-5 flex">
                        <div className="me-4 w-1/2">
                            <label htmlFor="telefone_1" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Telefone 1</label>
                            <InputMask name="telefone_1" id="telefone_1" mask={telMask.mask} replacement={telMask.replacement} value={formData.telefone_1!} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="(__) ____-____" />
                        </div>
                        <div className="w-1/2">
                            <label htmlFor="telefone_2" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Telefone 2</label>
                            <input type="text" name="telefone_2" id="telefone_2" value={formData.telefone_2!} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                        </div>
                    </div>
                    <div className="mb-5 flex">
                        <div className="me-4 w-1/2">
                            <label htmlFor="email_1" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">E-mail 1</label>
                            <input type="email" name="email_1" id="email_1" value={formData.email_1!} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                        </div>
                        <div className="w-1/2">
                            <label htmlFor="email_2" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">E-mail 2</label>
                            <input type="email" name="email_2" id="email_2" value={formData.email_2!} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                        </div>
                    </div>
                    <div className="mb-5">
                        <label htmlFor="faixa_ip" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Faixa IP</label>
                        <input type="text" name="faixa_ip" id="faixa_ip" value={formData.faixa_ip!} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                    </div>
                    <div className="flex items-center mb-4">
                        <input id="ativo" type="checkbox" name="ativo" checked={formData.ativo} onChange={handleChange} className="cursor-pointer w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                        <label htmlFor="ativo" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Ativo?</label>
                    </div>
                    <button type="submit" className="cursor-pointer text-white bg-blue-600 hover:bg-blue-700 focus:outline-none font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">{props.id ? 'Atualizar' : 'Cadastrar'}</button>
                </form>
            </div>
        </div>
        </>
    );
}