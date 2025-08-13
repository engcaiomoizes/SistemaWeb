"use client";

import { useRouter } from "next/navigation";
import React, { SyntheticEvent } from "react";
import { useState } from "react";

interface FormValues {
    login: string;
    senha: string;
    nome: string;
    email: string;
    cargo: string;
}

export default function FormCadastro() {
    const { push } = useRouter();

    const [formData, setFormData] = useState<FormValues>({
        login: '',
        senha: '',
        nome: '',
        email: '',
        cargo: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const router = useRouter();

    async function handleSubmit(e: SyntheticEvent) {
        e.preventDefault();

        try {
            const response = await fetch('/api/cadastrar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            console.log(result);

            if (response.ok) {
                sessionStorage.setItem('message', 'Usuário cadastrado! Aguarde o administrador liberar seu acesso.');
                push('/login');
            } else {
                console.log('Erro');
            }
        } catch (err) {
            console.log(err);
        } finally {
            //
        }
    }

    return (
        <>
        <div className="flex flex-col items-center justify-center mx-auto lg:py-0">
            <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                        Faça o seu cadastro
                    </h1>
                    <form className="space-y-4 md:space-y-6" method="POST" onSubmit={handleSubmit}>
                        <div className="flex flex-col group relative w-full h-16 mb-2">
                            <label htmlFor="login" className={`text-foreground font-bold absolute bottom-1.5 z-10 cursor-text group-focus-within:text-teal-500 group-focus-within:text-sm group-focus-within:cursor-default group-focus-within:-translate-y-8 ${formData.login ? '-translate-y-8 text-sm' : ''} transition-all ease-in-out duration-300`}>Login</label>
                            <input type="text" name="login" id="login" value={formData.login} onChange={handleChange} className="absolute bottom-0 border-b outline-none dark:bg-gray-800 focus:border-b-2 focus:border-teal-500 w-full py-1.5" required />
                        </div>
                        <div className="flex flex-col group relative w-full h-16 mb-2">
                            <label htmlFor="senha" className={`text-foreground font-bold absolute bottom-1.5 z-10 cursor-text group-focus-within:text-teal-500 group-focus-within:text-sm group-focus-within:cursor-default group-focus-within:-translate-y-8 ${formData.senha ? '-translate-y-8 text-sm' : ''} transition-all ease-in-out duration-300`}>Senha</label>
                            <input type="password" name="senha" id="senha" value={formData.senha} onChange={handleChange} className="absolute bottom-0 border-b outline-none dark:bg-gray-800 focus:border-b-2 focus:border-teal-500 w-full py-1.5" required />
                        </div>
                        <div className="flex flex-col group relative w-full h-16 mb-2">
                            <label htmlFor="nome" className={`text-foreground font-bold absolute bottom-1.5 z-10 cursor-text group-focus-within:text-teal-500 group-focus-within:text-sm group-focus-within:cursor-default group-focus-within:-translate-y-8 ${formData.nome ? '-translate-y-8 text-sm' : ''} transition-all ease-in-out duration-300`}>Nome</label>
                            <input type="text" name="nome" id="nome" value={formData.nome} onChange={handleChange} className="absolute bottom-0 border-b outline-none dark:bg-gray-800 focus:border-b-2 focus:border-teal-500 w-full py-1.5" required />
                        </div>
                        <div className="flex flex-col group relative w-full h-16 mb-2">
                            <label htmlFor="email" className={`text-foreground font-bold absolute bottom-1.5 z-10 cursor-text group-focus-within:text-teal-500 group-focus-within:text-sm group-focus-within:cursor-default group-focus-within:-translate-y-8 ${formData.email ? '-translate-y-8 text-sm' : ''} transition-all ease-in-out duration-300`}>E-mail</label>
                            <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className="absolute bottom-0 border-b outline-none dark:bg-gray-800 focus:border-b-2 focus:border-teal-500 w-full py-1.5" />
                        </div>
                        <div className="flex flex-col group relative w-full h-16 mb-2">
                            <label htmlFor="cargo" className={`text-foreground font-bold absolute bottom-1.5 z-10 cursor-text group-focus-within:text-teal-500 group-focus-within:text-sm group-focus-within:cursor-default group-focus-within:-translate-y-8 ${formData.cargo ? '-translate-y-8 text-sm' : ''} transition-all ease-in-out duration-300`}>Cargo</label>
                            <input type="text" name="cargo" id="cargo" value={formData.cargo} onChange={handleChange} className="absolute bottom-0 border-b outline-none dark:bg-gray-800 focus:border-b-2 focus:border-teal-500 w-full py-1.5" />
                        </div>
                        <button type="submit" className="cursor-pointer w-full text-white bg-teal-500 hover:bg-teal-600 focus:ring-4 focus:outline-none focus:ring-primary-300 rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 uppercase font-medium mt-4">Cadastrar</button>
                    </form>
                </div>
            </div>
        </div>
        </>
    );
}