'use client';

import { redirect, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { InputMask } from "@react-input/mask";
import { dataMask } from "@/lib/string";
import { FaChevronLeft } from "react-icons/fa";
import LoadingSpinner from "../loading/loadingSpinner";

interface FormValues {
    data: string;
    descricao: string;
}

export default function FeriadosForm(props: any) {
    const { push } = useRouter();

    const [loading, setLoading] = useState<boolean>(false);

    const [formData, setFormData] = useState<FormValues>({
        data: '',
        descricao: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

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
            const response = await fetch('/api/feriados', {
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
                push('/feriados');
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

            const response = await fetch(`/api/feriados/${props.id}`);

            if (!response.ok) {
                throw new Error(`Erro ao buscar tipo: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();

            console.log(data);

            if (data.response) {
                setFormData({
                    data: data.response.data,
                    descricao: data.response.descricao,
                })
            } else {
                push('/feriados');
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
                <button onClick={() => redirect('/feriados')} className="cursor-pointer flex items-center font-medium gap-2 ms-10"><FaChevronLeft /> Voltar</button>
                <form className="max-w-xl mx-auto" method="POST" onSubmit={handleSubmit}>
                    <div className="mb-5 w-1/3">
                        <label htmlFor="data" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Data</label>
                        <InputMask type="text" name="data" id="data" value={formData.data} onChange={handleChange} mask={dataMask.mask} replacement={dataMask.replacement} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="descricao" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Descrição</label>
                        <input type="text" name="descricao" id="descricao" value={formData.descricao} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                    </div>
                    <button type="submit" className="cursor-pointer text-white bg-blue-600 hover:bg-blue-700 focus:outline-none font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">{ props.id ? 'Atualizar' : 'Cadastrar' }</button>
                </form>
            </div>
        </div>
        </>
    );
}