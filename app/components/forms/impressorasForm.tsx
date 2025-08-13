"use client";

import { Local } from "@/types/locais";
import { redirect, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { FaChevronLeft } from "react-icons/fa";
import LoadingSpinner from "../loading/loadingSpinner";

interface FormValues {
    marca: string;
    modelo: string;
    observacoes?: string | null;
    localId: number;
    ip_addr: string;
}

export default function ImpressorasForm(props: any) {
    const { push } = useRouter();

    const [loading, setLoading] = useState<boolean>(false);

    const [formData, setFormData] = useState<FormValues>({
        marca: '',
        modelo: '',
        observacoes: null,
        localId: 0,
        ip_addr: '',
    });

    const [locais, setLocais] = useState<Local[]>([]);

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

    const handleLoadLocais = async () => {
        try {
            setLoading(true);

            const response = await fetch('/api/locais');

            const data = await response.json();

            setLocais(data.response);
            setFormData({ ...formData, localId: data.response[0].id });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleLoadLocais();
        // if (props.id)
        //     handleLoad();
    }, []);

    useEffect(() => {
        if (props.id && locais.length > 0)
            handleLoad();
    }, [locais]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/impressoras', {
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
                push('/impressoras');
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

            const response = await fetch(`/api/impressoras/${props.id}`);

            if (!response.ok) {
                throw new Error(`Erro ao buscar impressoras: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();

            if (data.response) {
                setFormData({
                    marca: data.response.marca,
                    modelo: data.response.modelo,
                    observacoes: data.response.observacoes,
                    localId: data.response.localId,
                    ip_addr: data.response.ip_addr,
                });
            } else {
                push('/impressoras');
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
                <button onClick={() => redirect('/impressoras')} className="cursor-pointer flex items-center font-medium gap-2 ms-10"><FaChevronLeft /> Voltar</button>
                <form className="max-w-xl mx-auto" method="POST" onSubmit={handleSubmit}>
                    <div className="mb-5">
                        <label htmlFor="marca" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Marca</label>
                        <input type="text" name="marca" id="marca" value={formData.marca} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="modelo" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Modelo</label>
                        <input type="text" name="modelo" id="modelo" value={formData.modelo} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="observacoes" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Observações</label>
                        <input type="text" name="observacoes" id="observacoes" value={formData.observacoes!} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="localId" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Local</label>
                        <select name="localId" id="localId" value={formData.localId} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                            {
                                locais.map((item) => (
                                    <option key={item.id} value={item.id}>{item.nome}</option>
                                ))
                            }
                        </select>
                    </div>
                    <div className="mb-5">
                        <label htmlFor="ip_addr" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">IP Addr.</label>
                        <input type="text" name="ip_addr" id="ip_addr" value={formData.ip_addr} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                    </div>
                    <button type="submit" className="cursor-pointer text-white bg-blue-600 hover:bg-blue-700 focus:outline-none font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">{ props.id ? 'Atualizar' : 'Cadastrar' }</button>
                </form>
            </div>
        </div>
        </>
    );
}