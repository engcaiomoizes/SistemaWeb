'use client';

import LoadingSpinner from "@/components/loading/loadingSpinner";
import RichTextViewer from "@/components/rich-text-viewer";
import { useCallback, useEffect, useState } from "react";

interface Update {
    id: number;
    numero: string;
    resumo: string;
    notas: string;
    created_at: Date;
    updated_at: Date;
}

export default function PatchNotes() {
    const [updates, setUpdates] = useState<Update[]>([]);

    const [loading, setLoading] = useState<boolean>(false);

    const handleLoad = useCallback(async () => {
        try {
            setLoading(true);

            const response = await fetch('/api/updates');

            const data = await response.json();

            setUpdates(data.updates);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        handleLoad();
    }, [handleLoad]);

    if (loading) return <LoadingSpinner />;

    return (
        <div className="flex justify-center py-20 px-10 ms-12">
            <div className="container">
                {
                    updates && updates.length > 0 ?
                    updates.map((item) => (
                        <div key={item.id} className="flex flex-col p-2 mb-2">
                            <div className="flex items-center relative border-b">
                                <span className="text-2xl me-6 font-bold text-gray-800 dark:text-white">{item.numero}</span>
                                <span>{item.resumo}</span>
                                <button className="cursor-pointer absolute right-0">
                                    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m8 10 4 4 4-4"/>
                                    </svg>
                                </button>
                            </div>
                            <div className="py-2 px-4 h-auto bg-gray-50 dark:bg-gray-800 rounded-b-lg shadow-md border-x border-b">
                                <RichTextViewer content={item.notas} />
                            </div>
                        </div>
                    ))
                    :
                    <></>
                }
            </div>
        </div>
    );
}