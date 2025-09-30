'use client';

import { useRouter } from "next/navigation";
import { SyntheticEvent, useState } from "react";
import Alert from "../alert";

export default function ForgotPassword(props: any) {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const { push } = useRouter();

    async function handleSubmit(e: SyntheticEvent) {
        e.preventDefault();

        try {
            setLoading(true);
            
            const response = await fetch('/api/cadastrar/forgot-password', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                }),
            });

            if (response.ok) {
                props.close();
                sessionStorage.setItem('message', "E-mail enviado! Verifique sua caixa de entrada para obter sua nova senha.");
                push('/login');
            } else {
                console.log("Ocorreu um erro inesperado.");
                setMessage("E-mail não cadastrado.");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
        <div className={`${props.isOpen ? '' : 'hidden'} fixed top-0 left-0 z-50`}>
            <div className="fixed bg-black opacity-40 w-full h-full" onClick={props.close}></div>
            <div className="fixed bg-white dark:bg-gray-800 shadow-lg p-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg max-h-[720px] min-w-96 w-[600px] overflow-y-auto">
                <div className="flex flex-col">
                    <span>Informe o e-mail do seu cadastro para recuperar sua senha.</span>
                    <form className="flex space-x-4" method="POST" onSubmit={handleSubmit}>
                        <input type="email" name="email" id="email" autoComplete="off" value={email} onChange={(e) => setEmail(e.target.value)} className="border-b border-gray-300 w-full outline-none p-1.5 focus:border-teal-600 transition ease-in-out duration-150" required />
                        <button className="cursor-pointer px-4 rounded bg-teal-500 text-white uppercase font-medium text-sm hover:bg-teal-600 transition ease-in-out duration-150">Enviar</button>
                    </form>
                    {
                        message && message !== "" &&
                        <Alert type="error" onClose={() => setMessage("")}>{message}</Alert>
                    }
                </div>
            </div>
        </div>
        </>
    );
}