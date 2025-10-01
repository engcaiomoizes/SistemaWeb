'use client';

import { useState } from "react";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSend: (msg: string) => void;
}

export default function Report({ isOpen, onClose, onSend }: Props) {
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        try {
            setLoading(true);

            const response = await fetch('/api/lista-ramal/report', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message }),
            });

            if (response.ok) {
                const data = await response.json();
                onSend(data.message);
                onClose();
            } else {
                onSend("Ocorreu um erro inesperado.");
                onClose();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`${isOpen ? '' : 'hidden'} fixed top-0 left-0 z-20`}>
            <div className="fixed top-0 left-0 bg-black opacity-40 w-full h-full" onClick={onClose}></div>
            <div className="fixed bg-white dark:bg-gray-800 px-6 pt-4 pb-6 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg max-h-[640px] min-w-96 shadow-lg">
                <div className="flex items-center relative">
                    <span className="font-bold uppercase">Reportar Problema</span>
                    <button className="cursor-pointer absolute right-0" onClick={onClose}>
                        <svg className="w-6 h-6 text-foreground" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 17.94 6M18 18 6.06 6"/>
                        </svg>
                    </button>
                </div>
                <div className="flex flex-col gap-2 mt-4">
                    <textarea className="border rounded outline-none p-2 w-[600px] h-32 focus:border-accent-foreground transition ease-in-out duration-150" value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
                    <button onClick={handleSend} className="cursor-pointer border border-accent-foreground p-2 rounded bg-accent-foreground text-accent uppercase font-bold text-sm hover:bg-transparent hover:text-accent-foreground transition ease-in-out duration-150">Enviar</button>
                </div>
            </div>
        </div>
    );
}