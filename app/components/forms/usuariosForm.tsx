"use client";

import { redirect, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { FaChevronLeft } from "react-icons/fa";
import LoadingSpinner from "../loading/loadingSpinner";

interface FormValues {
    login: string;
    nome: string;
    email: string;
    cargo: string;
}

export default function UsuariosForm(props: any) {
    const { push } = useRouter();

    const [loading, setLoading] = useState<boolean>(false);

    const [formData, setFormData] = useState<FormValues>({
        login: '',
        nome: '',
        email: '',
        cargo: '',
    });

    useEffect(() => {
        handleLoad();
    }, []);

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            //console.log(JSON.stringify(formData));

            const response = await fetch('/api/usuarios', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: Number(props.id),
                    ...formData
                }),
            });

            const result = await response.json();

            //console.log(result);

            if (response.ok) {
                //console.log("OK");
                push('/usuarios');
            } else {
                console.log("ERRO");
            }
        } catch (err: any) {
            console.error('Erro ao enviar requisição: ', err);
        } finally {
            //
        }
    };

    const handleLoad = async () => {
        try {
            setLoading(true);

            const response = await fetch(`/api/usuarios/${props.id}`);

            if (!response.ok) {
                throw new Error(`Erro ao buscar usuário: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();

            if (data.response) {
                setFormData({
                    login: data.response.login,
                    nome: data.response.nome,
                    email: data.response.email,
                    cargo: data.response.cargo,
                })
            } else {
                push('/usuarios');
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingSpinner />;

    return(
        <>
        <div className="flex justify-center p-10">
            <div className="container">
                <button onClick={() => redirect('/usuarios')} className="cursor-pointer flex items-center font-medium gap-2 ms-10"><FaChevronLeft /> Voltar</button>
                <form className="max-w-xl mx-auto" method="POST" onSubmit={handleSubmit}>
                    <div className="mb-5 flex">
                        <div className="me-4 w-1/2">
                            <label htmlFor="login" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Login</label>
                            <input type="text" name="login" id="login" value={formData.login} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                        </div>
                    </div>
                    <div className="mb-5">
                        <label htmlFor="nome" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nome</label>
                        <input type="text" name="nome" id="nome" value={formData.nome} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">E-mail</label>
                        <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="cargo" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Cargo</label>
                        <input type="text" name="cargo" id="cargo" value={formData.cargo} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                    </div>
                    <button type="submit" className="cursor-pointer text-white bg-blue-600 hover:bg-blue-700 focus:outline-none font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Atualizar</button>
                </form>
            </div>
        </div>
        </>
    );
}