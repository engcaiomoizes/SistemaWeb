'use client';

import LoadingSpinner from "@/components/loading/loadingSpinner";
import ChangeFoto from "@/components/modal/changeFoto";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface Perfil {
    id: string;
    nome: string | undefined;
    login: string | undefined;
    cargo?: string | undefined;
    email?: string | undefined;
    nivel: string;
}

function getImageDateURLFromBuffer(buffer: Buffer, contentType: string): string {
    // if (!Buffer.isBuffer(buffer)) {
    //     console.error("Erro: buffer não é um objeto Buffer válido: ", buffer);
    //     return '';
    // }
    const base64 = buffer.toString();
    console.log("teste: ", base64);
    return `data:${contentType};base64,${base64}`;
}

export default function Perfil() {
    const { data: session, update } = useSession();

    const [foto, setFoto] = useState("");

    const [perfil, setPerfil] = useState<Perfil>({
        id: "",
        nome: "",
        login: "",
        cargo: "",
        email: "",
        nivel: "",
    });

    const [temp, setTemp] = useState<Perfil>({
        id: "",
        nome: "",
        login: "",
        cargo: "",
        email: "",
        nivel: "",
    });

    const [loading, setLoading] = useState(true);

    const [open, setOpen] = useState(false);

    const [edit, setEdit] = useState(false);

    useEffect(() => {
        setPerfil({
            id: String(session?.user.id),
            nome: session?.user.nome,
            login: session?.user.login,
            cargo: session?.user.cargo!,
            email: session?.user.email!,
            nivel: session?.user.nivel!,
        });
        setTemp({
            id: String(session?.user.id),
            nome: session?.user.nome,
            login: session?.user.login,
            cargo: session?.user.cargo!,
            email: session?.user.email!,
            nivel: session?.user.nivel!,
        });
    }, [session]);

    useEffect(() => {
        const handleLoadFoto = async () => {
            try {
                const response = await fetch(`/api/cadastrar/foto?id=${perfil.id}`);

                const data = await response.json();

                setFoto(data.fotoDataUrl);

                console.log(data.fotoDataUrl);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        if (perfil.nome != undefined && perfil.nome != "") {
            handleLoadFoto();
        }
    }, [perfil]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        // if (type === 'checkbox') {
        //     const target = e.target as HTMLInputElement;
        //     setPerfil({ ...perfil, [name]: target.checked });
        //     return;
        // }

        setPerfil({
            ...perfil,
            [name]: value,
        });
    };

    const handleEditar = async () => {
        try {
            const response = await fetch('/api/cadastrar', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(perfil),
            });

            const data = await response.json();

            if (response.ok) {
                console.log(data);
                await update();
            }
        } catch (err) {
            console.error(err);
        }
        setEdit(false);
    };

    const handleCancelar = () => {
        setPerfil(temp);
        setEdit(false);
    };

    if (loading) return <LoadingSpinner />;

    return (
        <>
        <div className="flex justify-center p-10 ms-12">
            <div className="container">
                <ChangeFoto isOpen={open} close={() => setOpen(false)} userId={perfil.id} fotoAtual={foto} />
                <div className="relative flex space-x-6 py-6 px-10 border rounded-lg bg-white dark:bg-gray-800 mb-6">        
                    {
                        !edit ?
                        <button onClick={() => setEdit(true)} className="absolute top-1/2 -translate-y-1/2 right-10 cursor-pointer text-accent-foreground">
                            <svg className="w-20 h-20" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"/>
                            </svg>
                        </button>
                        :
                        <div className="flex items-center space-x-4 absolute top-1/2 -translate-y-1/2 right-10">
                            <button onClick={handleEditar} className="cursor-pointer text-accent-foreground">
                                <svg className="w-20 h-20" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 11.917 9.724 16.5 19 7.5"/>
                                </svg>
                            </button>
                            <button onClick={handleCancelar} className="cursor-pointer text-accent-foreground">
                                <svg className="w-20 h-20" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6"/>
                                </svg>
                            </button>
                        </div>
                    }
                    <div onClick={() => setOpen(true)} className="cursor-pointer relative group w-46 h-46 rounded-full overflow-hidden bg-accent">
                        <div className="absolute flex justify-center items-center w-full h-full bg-transparent z-20 group-hover:bg-foreground/30 transition ease-in-out duration-100">
                            <span className="hidden group-hover:block transition ease-in-out duration-100">
                                <svg className="w-12 h-12 text-accent" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                    <path fill-rule="evenodd" d="M7.5 4.586A2 2 0 0 1 8.914 4h6.172a2 2 0 0 1 1.414.586L17.914 6H19a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h1.086L7.5 4.586ZM10 12a2 2 0 1 1 4 0 2 2 0 0 1-4 0Zm2-4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z" clip-rule="evenodd"/>
                                </svg>
                            </span>
                        </div>
                        {
                            foto ?
                            <img src={foto} alt="" className="absolute object-cover" />
                            :
                            <svg className="w-full h-full absolute -bottom-8 left-1/2 -translate-x-1/2 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                <path fill-rule="evenodd" d="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4h-4Z" clip-rule="evenodd"/>
                            </svg>
                        }
                    </div>
                    <div className="flex flex-col justify-center py-8 text-accent-foreground">
                        <div className="mb-1">
                            {
                                !edit ?
                                <span className="text-4xl font-bold uppercase">{perfil?.nome}</span>
                                :
                                <input type="text" name="nome" id="nome" value={perfil?.nome} onChange={handleChange} className="border-b outline-none font-bold text-4xl uppercase w-full" />
                            }
                        </div>
                        <div className="mb-4">
                            {
                                !edit ?
                                <span className="font-medium">{perfil?.cargo}</span>
                                :
                                <input type="text" name="cargo" id="cargo" value={perfil?.cargo} onChange={handleChange} className="border-b outline-none font-medium w-full" />
                            }
                        </div>
                        <div>
                            <span className="flex items-center">
                                <svg className="w-6 h-6 me-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M2.038 5.61A2.01 2.01 0 0 0 2 6v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6c0-.12-.01-.238-.03-.352l-.866.65-7.89 6.032a2 2 0 0 1-2.429 0L2.884 6.288l-.846-.677Z"/>
                                    <path d="M20.677 4.117A1.996 1.996 0 0 0 20 4H4c-.225 0-.44.037-.642.105l.758.607L12 10.742 19.9 4.7l.777-.583Z"/>
                                </svg>
                                {
                                    !edit ?
                                    perfil?.email
                                    :
                                    <input type="email" name="email" id="email" value={perfil?.email} onChange={handleChange} className="border-b outline-none w-full" />
                                }
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex py-6 px-10 border rounded-lg bg-white dark:bg-gray-800">
                    <div className="flex flex-col">
                        <span className="uppercase font-medium text-sm text-accent-foreground">Seu Nível de acesso: </span>
                        <span className="uppercase font-bold text-3xl text-teal-500 hover:text-teal-600 transition ease-in-out duration-150 cursor-default">{perfil.nivel}</span>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}