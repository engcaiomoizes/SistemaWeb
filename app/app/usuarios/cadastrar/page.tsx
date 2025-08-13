"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface FormValues {
    login: string;
    senha: string;
    nome: string;
    ativo: boolean;
}

export default function CadastrarSuprimento() {
    const { push } = useRouter();

    const [formData, setFormData] = useState<FormValues>({
        login: '',
        senha: '',
        nome: '',
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            //console.log(JSON.stringify(formData));

            const response = await fetch('/api/usuarios', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            //console.log(result);

            if (response.ok) {
                //console.log("OK");
                sessionStorage.setItem('message', 'Usuário cadastrado com sucesso!');
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

    return (
        <>
        <div className="flex justify-center p-10">
            <div className="container">
                <form className="max-w-xl mx-auto" method="POST" onSubmit={handleSubmit}>
                    <div className="mb-5 flex">
                        <div className="me-4 w-1/2">
                            <label htmlFor="login" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Login</label>
                            <input type="text" name="login" id="login" value={formData.login} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                        </div>
                        <div className="w-1/2">
                            <label htmlFor="senha" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Senha</label>
                            <input type="text" name="senha" id="senha" value={formData.senha} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                        </div>
                    </div>
                    <div className="mb-5">
                        <label htmlFor="nome" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nome</label>
                        <input type="text" name="nome" id="nome" value={formData.nome} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                    </div>
                    <div className="flex items-center mb-4">
                        <input name="ativo" id="ativo" type="checkbox" checked={formData.ativo} onChange={handleChange} className="cursor-pointer w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                        <label htmlFor="ativo" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Ativo?</label>
                    </div>
                    <button type="submit" className="cursor-pointer text-white bg-blue-600 hover:bg-blue-700 focus:outline-none font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Cadastrar</button>
                </form>
            </div>
        </div>
        </>
    );
}