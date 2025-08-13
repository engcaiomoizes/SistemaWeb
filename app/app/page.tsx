"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from 'next-auth/react';
import Welcome from "@/components/welcome";
import LoadingSpinner from "@/components/loading/loadingSpinner";
import Logs from "@/components/views/logs";
import LastPatrimonios from "@/components/views/lastPatrimonios";

export default function Home() {
    const [welcome, setWelcome] = useState(true);

    const { data: session, status } = useSession();

    const loading = !session?.user.nome;

    useEffect(() => {
        //
    }, []);

    if (loading) return <LoadingSpinner />;

    return (
        <>
        <div className="flex justify-center p-10">
            <div className="container">
                <div className="flex flex-col items-center">
                    <h1>Olá, {session?.user.nome}.</h1>
                    <h1 className="">Bem-Vindo(a) ao Sistema SMAS!</h1>
                    <div className="flex mt-6 w-full gap-6">
                        {
                            (session.user.nivel === "Administrador" || session.user.nivel === "CPD") &&
                            <Logs />
                        }
                        <LastPatrimonios />
                    </div>
                </div>
            </div>
        </div>
        {/* <Welcome visible={welcome} close={() => setWelcome(false)} /> */}
        </>
    );
}