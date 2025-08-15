"use client";

import Alert from "@/components/alert";
import ForgotPassword from "@/components/modal/forgotPassword";
import ThemeSwitcher from "@/components/theme-switcher";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { SyntheticEvent, useEffect } from "react";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {
    const [message, setMessage] = useState('');
    const [alertType, setAlertType] = useState<'success' | 'error' | 'warning' | 'default' | 'secondary' | undefined>();
    const handleClose = () => setMessage("");

    const [login, setLogin] = useState('');
    const [senha, setSenha] = useState('');

    // Forgot Password
    const [isOpen, setIsOpen] = useState(false);

    const [passView, setPassView] = useState(false);

    useEffect(() => {
        const storedMessage = sessionStorage.getItem('message');
        if (storedMessage) {
            setAlertType('success');
            setMessage(storedMessage);
            sessionStorage.removeItem('message');
        }
    }, []);

    const router = useRouter();

    async function handleSubmit(e: SyntheticEvent) {
        e.preventDefault();

        try {
            const response = await signIn('credentials', {
                redirect: false,
                login,
                senha,
            });

            console.log('[LOGIN_RESPONSE]: ', response);

            if (!response?.error) {
                router.refresh();
                router.push('/');
            } else {
                console.log('[LOGIN_ERROR]: Senha incorreta!');
                setAlertType('error');
                setMessage("Login e/ou senha incorreta!");
            }
        } catch (err) {
            console.log(err);
        } finally {
            //
        }
    }

    return (
        <>
        <div className="flex justify-center p-10">
            <div className="container">
                <div className="bg-gray-800 absolute top-0 right-0">
                    <ThemeSwitcher />
                </div>
                <div className="flex flex-col items-center justify-center mx-auto lg:py-0">
                    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                        <div className="p-6 space-y-4 md:space-y-2 sm:p-8">
                            {/* <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                Faça login na sua conta
                            </h1> */}
                            <div className="flex justify-center">
                                <img src="/static/img/logo_white_aracatuba.png" alt="" className="w-28" />
                            </div>
                            <form className="space-y-4 md:space-y-6" method="POST" onSubmit={handleSubmit}>
                                <div className="flex flex-col group relative w-full h-16 mb-2">
                                    <label htmlFor="login" className={`text-foreground font-bold absolute bottom-1.5 z-10 cursor-text group-focus-within:text-teal-500 group-focus-within:text-sm group-focus-within:cursor-default group-focus-within:-translate-y-8 ${login ? '-translate-y-8 text-sm' : ''} transition-all ease-in-out duration-300`}>Login</label>
                                    <input type="text" name="login" id="login" value={login} onChange={(e) => setLogin(e.target.value)} className="absolute bottom-0 border-b outline-none dark:bg-gray-800 focus:border-b-2 focus:outline-none focus:border-teal-500 w-full py-1.5" required />
                                </div>
                                <div className="flex flex-col group relative w-full h-16 mb-2">
                                    <label htmlFor="senha" className={`text-foreground font-bold absolute bottom-1.5 z-10 cursor-text group-focus-within:text-teal-500 group-focus-within:text-sm group-focus-within:cursor-default group-focus-within:-translate-y-8 ${senha ? '-translate-y-8 text-sm' : ''} transition-all ease-in-out duration-300`}>Senha</label>
                                    <input type={`${passView ? 'text' : 'password'}`} name="senha" id="senha" value={senha} onChange={(e) => setSenha(e.target.value)} className="absolute bottom-0 border-b outline-none dark:bg-gray-800 focus:border-b-2 focus:border-teal-500 w-full py-1.5 pe-8" required />
                                    <button type="button" onClick={() => setPassView(prev => !prev)} className={`cursor-pointer absolute bottom-2 end-2 ${passView ? 'text-teal-500' : 'text-gray-500'}`}>{passView ? <FaEye /> : <FaEyeSlash />}</button>
                                </div>
                                <div className="flex items-center justify-end mt-4">
                                    <span onClick={() => setIsOpen(true)} className="cursor-pointer text-sm font-medium text-primary-600 hover:underline hover:text-teal-500 dark:text-primary-500">Esqueceu sua senha?</span>
                                </div>
                                <button type="submit" className="cursor-pointer w-full text-white bg-teal-400 hover:bg-teal-500 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center uppercase font-medium">Entrar</button>
                                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                    Não possui um usuário? <Link href={ `/cadastrar` } className="font-bold text-primary-600 hover:underline hover:text-teal-600 dark:text-primary-500">Cadastre-se</Link>
                                </p>
                            </form>
                        </div>
                    </div>
                    <Alert type={alertType} onClose={handleClose}>{message}</Alert>
                </div>
            </div>
        </div>
        <ForgotPassword isOpen={isOpen} close={() => setIsOpen(false)} />
        </>
    );
}