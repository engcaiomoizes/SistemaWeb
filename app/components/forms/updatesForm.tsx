"use client";

import { redirect, useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import RichTextEditor from "../rich-text-editor";
import { FaChevronLeft } from "react-icons/fa";
import LoadingSpinner from "../loading/loadingSpinner";

interface FormValues {
    numero: string;
    resumo: string;
    notas: string;
}

export default function UpdatesForm(props: any) {
    const { push } = useRouter();

    const [loading, setLoading] = useState<boolean>(false);

    const onChange = (content: string) => {
        setFormData({
            ...formData,
            notas: content,
        });
    };

    const [formData, setFormData] = useState<FormValues>({
        numero: '',
        resumo: '',
        notas: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleLoad = useCallback(async () => {
        try {
            setLoading(true);

            const response = await fetch(`/api/updates/${props.id}`);

            if (!response.ok) {
                throw new Error(`Erro ao buscar update: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();

            if (data.response) {
                setFormData({
                    numero: data.response.numero,
                    resumo: data.response.resumo,
                    notas: data.response.notas,
                });
            } else {
                push('/updates');
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }, [props.id, push]);

    useEffect(() => {
        if (props.id)
            handleLoad();
    }, [handleLoad]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/updates', {
                method: props.id ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: Number(props.id),
                    ...formData
                }),
            });

            console.log(formData);

            const result = await response.json();

            if (response.ok) {
                push('/updates');
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
                <button onClick={() => redirect('/updates')} className="cursor-pointer flex items-center font-medium gap-2 ms-10"><FaChevronLeft /> Voltar</button>
                <form className="max-w-xl mx-auto" method="POST" onSubmit={handleSubmit}>
                    <div className="mb-5">
                        <label htmlFor="numero" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Número (Versão)</label>
                        <input type="text" name="numero" id="numero" value={formData.numero} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="resumo" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Resumo</label>
                        <input type="text" name="resumo" id="resumo" value={formData.resumo} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Notas</label>
                        <RichTextEditor content={formData.notas} onChange={onChange} />
                    </div>
                    <button type="submit" className="cursor-pointer text-white bg-blue-600 hover:bg-blue-700 focus:outline-none font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">{ props.id ? 'Atualizar' : 'Cadastrar' }</button>
                </form>
            </div>
        </div>
        </>
    );
}