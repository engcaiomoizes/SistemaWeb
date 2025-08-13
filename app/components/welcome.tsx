'use client';

import { useEffect, useState } from "react";

interface Welcome {
    id: number;
    title: string;
    content: string;
    ativo: boolean;
}

export default function Welcome(props: any) {
    const [welcomes, setWelcomes] = useState<Welcome[]>([]);

    const handleLoad = async () => {
        try {
            const response = await fetch('/api/welcomes');

            const data = await response.json();

            setWelcomes(data.response);
        } catch (err) {
            //
        }
    };

    useEffect(() => {
        handleLoad();
    }, []);

    return (
        <div className="absolute top-0 left-0">
            <div className={`${props.visible ? '' : 'hidden'} fixed top-0 left-0 z-20`}>
                <div className="fixed top-0 left-0 bg-background opacity-40 w-full h-full" onClick={props.close}></div>
                <div className="fixed bg-white dark:bg-gray-800 px-6 pt-4 pb-6 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg max-h-[720px] min-w-96 w-[640px] shadow-lg">
                {
                    welcomes && welcomes.length > 0 &&
                    welcomes.map((item) => (
                        <div key={item.id} className="flex flex-col items-center">
                            <span className="text-xl font-bold mb-2">{item.title}</span>
                            <span className="font-light">{item.content}</span>
                        </div>
                    ))
                }
                    <div className="flex flex-col items-center">
                        <span className="text-xl font-bold mb-2">Bem-vindo ao Sistema SMAS!</span>
                        <span className="font-light"></span>
                    </div>
                </div>
            </div>
        </div>
    );
}