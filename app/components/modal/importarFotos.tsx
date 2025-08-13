'use client';

import React, { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";
import { Loader2, Trash2, View } from "lucide-react";
import Link from "next/link";
import ModalConfirm from "./modalConfirm";

interface Props {
    item: any;
    show: boolean;
    close: () => void;
}

interface Foto {
    id: string;
    url: string;
}

export default function ImportarFotos(props: Props) {
    const [file, setFile] = useState<File | null>(null);
    const patrimonioId = props.item?.id;
    const inputRef = useRef<HTMLInputElement>(null);
    const [message, setMessage] = useState("");
    const [fotos, setFotos] = useState<Foto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [deleting, setDeleting] = useState<boolean>(false);
    const [id, setId] = useState<string>("");

    const handleFotos = async () => {
        const response = await fetch(`/api/fotos/${patrimonioId}`);

        const data = await response.json();

        if (response.ok) {
            setFotos(data.response);
        }
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!file || !patrimonioId) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('patrimonioId', patrimonioId.toString());

        const res = await fetch('/api/fotos', {
            method: 'POST',
            body: formData,
        });

        const data = await res.json();
        setMessage(data.message || 'Erro');

        if (res.ok) {
            setFile(null);
            handleFotos();
        }
    };

    useEffect(() => {
        if (props.show)
            handleFotos();
        else {
            setFile(null);
            setMessage("");
            setLoading(true);
        }
    }, [props.show]);

    const onConfirm = async (id: string) => {
        try {
            const response = await fetch(`/api/fotos`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }),
            });

            const data = await response.json();

            setMessage(data.message);

            setDeleting(false);

            handleFotos();
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <>
        <div className="absolute top-0 left-0">
            <div className={`${props.show ? '' : 'hidden'} fixed top-0 left-0 z-20`}>
                <div className="fixed top-0 left-0 bg-black opacity-40 w-full h-full" onClick={() => {setDeleting(false);props.close()}}></div>
                <div className="fixed bg-white dark:bg-gray-800 px-6 pt-4 pb-6 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg max-h-[640px] min-w-96 shadow-lg">
                    <div className="flex items-center relative">
                        <span className="font-bold uppercase">Importar fotos</span>
                        <button className="absolute right-0 cursor-pointer" onClick={() => {setDeleting(false);props.close()}}>
                            <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6"/>
                            </svg>
                        </button>
                    </div>
                    <span className="flex text-sm mb-2"><b>Item:</b>&nbsp;{props.item?.tipo_fk.nome} {props.item?.descricao ?? ''} - {props.item?.num_patrimonio} {props.item?.orgao_patrimonio}</span>
                    <div className="flex justify-center">
                        {
                            loading ?
                            <Loader2 className="h-10 w-10 animate-spin" />
                            :
                            fotos.length > 0 ?
                            <Carousel opts={{ align: "start" }} className="max-w-64">
                                <CarouselContent>
                                    {
                                        fotos.map((foto, index) => (
                                            <CarouselItem key={index}>
                                                <div className="p-1">
                                                    <Card className="bg-accent relative group">
                                                        <div className="hidden group-hover:flex absolute items-center justify-center gap-6 w-full h-full bg-accent-foreground/25 rounded-lg top-0">
                                                            <Link href={ `/api/fotos/exibir/${foto.url}` } target="_blank" className="text-accent cursor-pointer">
                                                                <View size={32} />
                                                            </Link>
                                                            <button className="text-accent cursor-pointer">
                                                                <Trash2 size={32} onClick={() => {setDeleting(true);setId(foto.id)}} />
                                                            </button>
                                                        </div>
                                                        <CardContent className="flex aspect-square items-center justify-center">
                                                            <img src={`/api/fotos/exibir/${foto.url}`} alt="" className="w-full h-full object-contain" />
                                                            {/* <span className="text-3xl font-semibold">{index + 1}</span> */}
                                                        </CardContent>
                                                    </Card>
                                                </div>
                                            </CarouselItem>
                                        ))
                                    }
                                </CarouselContent>
                                <CarouselPrevious />
                                <CarouselNext /> 
                            </Carousel>
                            :
                            <span className="font-bold text-orange-600">Nenhuma foto cadastrada!</span>
                        }
                    </div>
                    <div className="flex justify-center mt-4">
                        <form onSubmit={handleSubmit} encType="multipart/form-data" className="flex flex-col gap-2">
                            <input type="file" accept="image/*" ref={inputRef} onChange={(e) => setFile(e.target.files?.[0] || null)} className="hidden" />
                            <Button className="cursor-pointer" variant="default" onClick={() => inputRef.current?.click()}>Importar</Button>
                            <span className="text-sm text-center">{file ? file.name : 'Nenhuma foto selecionada!'}</span>
                            <Button className={`cursor-pointer ${file ? '' : 'hidden'}`} type="submit">Adicionar</Button>
                            <span className="text-center font-medium text-accent-foreground">{message}</span>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <ModalConfirm isOpen={deleting} texto="Deseja realmente deletar esta foto?" onConfirm={() => onConfirm(id)} onCancel={() => setDeleting(false)} />
        </>
    );
}