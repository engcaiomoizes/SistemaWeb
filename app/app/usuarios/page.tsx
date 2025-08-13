"use client";

import Alert from "@/components/alert";
import Badge from "@/components/badge";
import LoadingSpinner from "@/components/loading/loadingSpinner";
import ChangeNivel from "@/components/modal/changeNivel";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ChangeEvent, useEffect, useState } from "react";

interface Usuarios {
    id: number;
    login: string;
    senha: string;
    nome: string;
    ativo: boolean;
    nivel: number;
    nivel_fk: Nivel;
}

interface Nivel {
    id: number;
    nome: string;
}

export default function Usuarios() {
    const { data: session } = useSession();

    const [usuarios, setUsuarios] = useState<Usuarios[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletar, setDeletar] = useState(false);
    const [item, setItem] = useState(0);

    const [message, setMessage] = useState('');
    const [alertType, setAlertType] = useState<'success' | 'error' | 'warning' | 'default' | 'secondary' | undefined>();
    const handleClose = () => setMessage("");

    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const storedMessage = sessionStorage.getItem('message');
        if (storedMessage) {
            setAlertType('success');
            setMessage(storedMessage);
            sessionStorage.removeItem('message');
        }

        handleReload();
    }, []);

    const handleAtivo = async (event: ChangeEvent<HTMLInputElement>, id: number, ativo: boolean) => {
        //console.log(id);
        try {
            const response = await fetch('/api/usuarios', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: id, loggedId: session?.user.id, ativo: ativo }),
            });

            const result = await response.json();

            if (response.ok) {
                //console.log('OK!');
                handleReload();
            } else {
                //console.log('ERRO!');
                setAlertType('success');
                setMessage(result.message);
            }
        } catch (err) {
            console.error('Erro ao enviar requisição: ', err);
        } finally {
            //
        }
    };

    const handleReload = async () => {
        try {
            const response = await fetch('/api/usuarios');
            if (!response.ok) {
                throw new Error(`Erro ao buscar locais: ${response.status} - ${response.statusText}`);
            }
            const data = await response.json();
            setUsuarios(data.response);
            //console.log(data.response);
            setLoading(false);
        } catch (err: any) {
            console.log(err.message);
        } finally {
            //
        }
    };

    const handleConfirmar = (id: number) => {
        setItem(id);
        setDeletar(true);
    };

    const handleCancelar = () => {
        setItem(0);
        setDeletar(false);
    };

    const handleDelete = async (id: number) => {
        if (deletar) {
            try {
                const response = await fetch('/api/usuarios', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id: id }),
                });
    
                const result = await response.json();
    
                if (response.ok) {
                    setMessage("Usuário deletado com sucesso!");
                    setAlertType('success');
                    handleReload();
                    setItem(0);
                    setDeletar(false);
                    window.scrollTo(0,0);
                } else {
                    console.log("Erro!");
                    //console.log(result);
                    setAlertType('error');
                    setMessage(result.message);
                    handleCancelar();
                }
            } catch (err) {
                console.error('Erro ao enviar requisição: ', err);
            } finally {
                //
            }
        }
    };

    const handleSearch = (term: string) => {
        setSearchTerm(term);
    };

    // Nível
    const [nivel, setNivel] = useState(false);
    const [usuarioAtual, setUsuarioAtual] = useState<any>(null);

    const handleNivel = (item: any) => {
        setUsuarioAtual(item);
        setNivel(true);
    };

    const handleDefiniu = () => {
        setMessage("Nível definido com sucesso!");
        setAlertType("success");
        handleReload();
    };

    if (loading) return <LoadingSpinner />;

    return (
        <>
        <div className="flex justify-center p-10 ms-12">
            <div className="container">
                <div className={`${message ? 'grid grid-cols-2' : 'flex justify-end'} items-center mb-2`}>
                    <Alert type={alertType} onClose={handleClose}>{message}</Alert>
                    <Link href={ `/usuarios/cadastrar` } className="justify-self-end text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-semibold rounded-lg text-xs uppercase px-5 py-2.5 focus:outline-none dark:focus:ring-blue-800 transition ease-in-out duration-100">Cadastrar</Link>
                </div>
                <div className="flex justify-end w-full mb-2 space-x-4">
                    <input onChange={(e) => handleSearch(e.target.value)} className="bg-white dark:bg-gray-800 border rounded-lg w-1/2 py-2 px-3 max-h-10 text-sm outline-none focus:border-blue-500" type="text" name="search" id="search" placeholder="Informe sua pesquisa aqui..." />
                    <div className="flex space-x-2">
                        <button className="cursor-pointer border px-1.5 rounded-lg border-blue-700 bg-blue-700 hover:bg-blue-800 hover:border-blue-800 transition ease-in-out duration-100">
                            <svg className="w-6 h-6 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                <path fill-rule="evenodd" d="M9 7V2.221a2 2 0 0 0-.5.365L4.586 6.5a2 2 0 0 0-.365.5H9Zm2 0V2h7a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9h5a2 2 0 0 0 2-2Zm2-2a1 1 0 1 0 0 2h3a1 1 0 1 0 0-2h-3Zm0 3a1 1 0 1 0 0 2h3a1 1 0 1 0 0-2h-3Zm-6 4a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-6Zm8 1v1h-2v-1h2Zm0 3h-2v1h2v-1Zm-4-3v1H9v-1h2Zm0 3H9v1h2v-1Z" clip-rule="evenodd"/>
                            </svg>
                        </button>
                        <button className="cursor-pointer border px-1.5 rounded-lg border-blue-700 bg-blue-700 hover:bg-blue-800 hover:border-blue-800 transition ease-in-out duration-100">
                            <svg className="w-6 h-6 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                <path fill-rule="evenodd" d="M9 2.221V7H4.221a2 2 0 0 1 .365-.5L8.5 2.586A2 2 0 0 1 9 2.22ZM11 2v5a2 2 0 0 1-2 2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2 2 2 0 0 0 2 2h12a2 2 0 0 0 2-2 2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2V4a2 2 0 0 0-2-2h-7Zm-6 9a1 1 0 0 0-1 1v5a1 1 0 1 0 2 0v-1h.5a2.5 2.5 0 0 0 0-5H5Zm1.5 3H6v-1h.5a.5.5 0 0 1 0 1Zm4.5-3a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h1.376A2.626 2.626 0 0 0 15 15.375v-1.75A2.626 2.626 0 0 0 12.375 11H11Zm1 5v-3h.375a.626.626 0 0 1 .625.626v1.748a.625.625 0 0 1-.626.626H12Zm5-5a1 1 0 0 0-1 1v5a1 1 0 1 0 2 0v-1h1a1 1 0 1 0 0-2h-1v-1h1a1 1 0 1 0 0-2h-2Z" clip-rule="evenodd"/>
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    <div className="flex items-center">
                                        Nome
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    <div className="flex items-center">
                                        Nível
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    <div className="flex items-center">
                                        Login
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Ativo
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    <span className="sr-only">Edit</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                usuarios.length > 0 ?
                                usuarios.map((item) => (
                                    <tr key={item.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            {item.nome}
                                        </th>
                                        <td className="px-6 py-4">
                                            {
                                                item.nivel ?
                                                <button onClick={() => handleNivel(item)} className="rounded-full">
                                                    <Badge>{item.nivel_fk.nome}</Badge>
                                                </button>
                                                :
                                                <button onClick={() => handleNivel(item)} className="cursor-pointer underline text-blue-600">Definir nível</button>
                                            }
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.login}
                                        </td>
                                        <td className="px-6 py-4">
                                            <label className={`inline-flex items-center ${item.nivel ? 'cursor-pointer' : 'cursor-not-allowed'}`}>
                                                <input type="checkbox" disabled={!item.nivel} checked={item.ativo} onChange={(event) => handleAtivo(event, item.id, event.target.checked)} className="sr-only peer" />
                                                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                                            </label>
                                        </td>
                                        <td className="px-0 py-4 text-right flex">
                                            <Link href={ `/usuarios/editar/${item.id}` } className="font-medium text-blue-600 dark:text-blue-500 hover:underline me-2">
                                                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"/>
                                                </svg>
                                            </Link>
                                            <button onClick={() => handleConfirmar(item.id)} className="cursor-pointer font-medium text-blue-600 dark:text-blue-500 hover:underline me-2">
                                                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/>
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                                :
                                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                                    <td className="px-6 py-4 text-center" colSpan={5}>Nenhum usuário cadastrado!</td>
                                </tr>
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div id="popup-modal" tabIndex={-1} className={`${deletar ? '' : 'hidden'} overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-start w-full md:inset-0 h-[calc(100%-1rem)] max-h-full`}>
            <div className="relative p-4 w-full max-w-md max-h-full">
                <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
                    <button type="button" onClick={() => handleCancelar()} className="cursor-pointer absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="popup-modal">
                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                        </svg>
                        <span className="sr-only">Close modal</span>
                    </button>
                    <div className="p-4 md:p-5 text-center">
                        <svg className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                        </svg>
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Deseja realmente deletar este Usuário?</h3>
                        <button data-modal-hide="popup-modal" type="button" onClick={() => handleDelete(item)} className="cursor-pointer text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">
                            Sim
                        </button>
                        <button data-modal-hide="popup-modal" type="button" onClick={() => handleCancelar()} className="cursor-pointer py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Não</button>
                    </div>
                </div>
            </div>
        </div>

        <ChangeNivel item={usuarioAtual} show={nivel} close={() => setNivel(false)} reload={handleDefiniu} />

        </>
    );
}