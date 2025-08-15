"use client";

import LoadingSpinner from "@/components/loading/loadingSpinner";
import LocaisView from "@/components/views/locaisView";
import Link from "next/link";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import Alert from "@/components/alert";
import StatusDot from "@/components/statusDot";

interface Local {
    id: number;
    nome: string;
    apelido: string;
    endereco: string;
    telefone_1: string | null;
    telefone_2: string | null;
    email_1: string | null;
    email_2: string | null;
    faixa_ip: string | null;
    ativo: boolean;
    status: 'online' | 'offline';
}

const ITEMS_PER_PAGE = 50;

export default function Locais() {
    const [locais, setLocais] = useState<Local[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletar, setDeletar] = useState(false);
    const [item, setItem] = useState(0);

    const [message, setMessage] = useState('');
    const [alertType, setAlertType] = useState<'success' | 'error' | 'warning' | 'default' | 'secondary' | undefined>();
    const handleClose = () => setMessage("");

    const [count, setCount] = useState(0);
    
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    
    const [searchTerm, setSearchTerm] = useState('');

    const [order, setOrder] = useState('');

    // Relatórios
    const [gerando, setGerando] = useState(false);

    useEffect(() => {
        const storedMessage = sessionStorage.getItem('message');
        if (storedMessage) {
            setAlertType('success');
            setMessage(storedMessage);
            sessionStorage.removeItem('message');
        }
    }, []);

    const handleAtivo = async (event: ChangeEvent<HTMLInputElement>, id: number, ativo: boolean) => {
        //console.log(id);
        try {
            const response = await fetch('/api/locais', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: id, ativo: ativo }),
            });

            const result = await response.json();

            if (response.ok) {
                //console.log('OK!');
                handleReload();
            } else {
                //console.log('ERRO!');
            }
        } catch (err) {
            console.error('Erro ao enviar requisição: ', err);
        } finally {
            //
        }
    };

    const handleReload = useCallback(async () => {
        try {
            const response = await fetch(
                `/api/locais?page=${currentPage}&limit=${ITEMS_PER_PAGE}${searchTerm ? `&searchTerm=${searchTerm}` : ''}${order != '' ? `&order=${order}` : ''}`
            );
            if (!response.ok) {
                throw new Error(`Erro ao buscar locais: ${response.status} - ${response.statusText}`);
            }
            const data = await response.json();
            setLocais(data.response);
            //console.log(data);
            setLoading(false);
        } catch (err: any) {
            console.log(err.message);
        } finally {
            //
        }
    }, [currentPage, searchTerm, order, count]);

    useEffect(() => {
        handleReload();
    }, [currentPage, searchTerm, order, count, handleReload]);

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
                const response = await fetch('/api/locais', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id: id }),
                });
    
                const result = await response.json();
    
                if (response.ok) {
                    setMessage("Local deletado com sucesso!");
                    setAlertType('success');
                    handleReload();
                    setItem(0);
                    setDeletar(false);
                    window.scrollTo(0,0);
                } else {
                    console.log("Erro!");
                }
            } catch (err) {
                console.error('Erro ao enviar requisição: ', err);
            } finally {
                //
            }
        }
    };

    const goToPreviousPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const goToNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    const goToPage = (pageNumber: number) => {
        setCurrentPage(Math.max(1, Math.min(pageNumber, totalPages)));
    };

    const handleSearch = (term: string) => {
        setSearchTerm(term);
    };

    const handleOrder = () => {
        if (order == '') {
            setOrder('asc');
        } else if (order == 'asc') {
            setOrder('desc');
        } else {
            setOrder('asc');
        }
    };

    const gerarListagem = async () => {
        try {
            setGerando(true);

            const response = await fetch(`${process.env.NEXT_PUBLIC_PYTHON_API_URL}/relatorio-locais`);

            if (!response.ok) {
                throw new Error("Ocorreu um erro inesperado no MySQL.");
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.target = '_blank';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error(err);
        } finally {
            setGerando(false);
        }
    };

    const [dados, setDados] = useState<Local>();
    const [view, setView] = useState(false);

    const handleView = (item: Local) => {
        setDados(item);
        setView(true);
    };

    if (loading) return <LoadingSpinner />;

    return (
        <>
        <div className="flex justify-center p-10 ms-12">
            <div className="container">
            <div className={`${message ? 'grid grid-cols-2' : 'flex justify-end'} items-center mb-2`}>
                    <Alert type={alertType} onClose={handleClose}>{message}</Alert>                   
                    <Link href={ `/locais/cadastrar` } className="justify-self-end text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-semibold rounded-lg text-xs uppercase px-5 py-2.5 focus:outline-none dark:focus:ring-blue-800 transition ease-in-out duration-100">Cadastrar</Link>
                </div>
                <div className="flex justify-end w-full mb-2 space-x-4">
                    <input onChange={(e) => handleSearch(e.target.value)} className="bg-white dark:bg-gray-800 border rounded-lg w-1/2 py-2 px-3 max-h-10 text-sm outline-none focus:border-blue-500" type="text" name="search" id="search" placeholder="Informe sua pesquisa aqui..." />
                    <div className="flex space-x-2">
                        {
                            gerando ?
                            <div role="status" className="flex justify-center">
                                <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/></svg>
                                <span className="sr-only">Loading...</span>
                            </div>
                            :
                            <button onClick={gerarListagem} className="cursor-pointer border px-1.5 rounded-lg border-blue-700 bg-blue-700 hover:bg-blue-800 hover:border-blue-800 transition ease-in-out duration-100">
                                <svg className="w-6 h-6 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                    <path fill-rule="evenodd" d="M9 2.221V7H4.221a2 2 0 0 1 .365-.5L8.5 2.586A2 2 0 0 1 9 2.22ZM11 2v5a2 2 0 0 1-2 2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2 2 2 0 0 0 2 2h12a2 2 0 0 0 2-2 2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2V4a2 2 0 0 0-2-2h-7Zm-6 9a1 1 0 0 0-1 1v5a1 1 0 1 0 2 0v-1h.5a2.5 2.5 0 0 0 0-5H5Zm1.5 3H6v-1h.5a.5.5 0 0 1 0 1Zm4.5-3a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h1.376A2.626 2.626 0 0 0 15 15.375v-1.75A2.626 2.626 0 0 0 12.375 11H11Zm1 5v-3h.375a.626.626 0 0 1 .625.626v1.748a.625.625 0 0 1-.626.626H12Zm5-5a1 1 0 0 0-1 1v5a1 1 0 1 0 2 0v-1h1a1 1 0 1 0 0-2h-1v-1h1a1 1 0 1 0 0-2h-2Z" clip-rule="evenodd"/>
                                </svg>
                            </button>
                        }
                    </div>
                </div>
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    <div className="flex items-center">
                                        Nome
                                        <button className="cursor-pointer" onClick={handleOrder}>
                                            {
                                                order == '' &&
                                                <svg className="w-3 h-3 ms-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z"/>
                                                </svg>
                                            }
                                            {
                                                order == 'asc' &&
                                                <svg className="w-3 h-3 ms-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                                    <path fill-rule="evenodd" d="M18.425 10.271C19.499 8.967 18.57 7 16.88 7H7.12c-1.69 0-2.618 1.967-1.544 3.271l4.881 5.927a2 2 0 0 0 3.088 0l4.88-5.927Z" clip-rule="evenodd"/>
                                                </svg>
                                            }
                                            {
                                                order == 'desc' &&
                                                <svg className="w-3 h-3 ms-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                                    <path fill-rule="evenodd" d="M5.575 13.729C4.501 15.033 5.43 17 7.12 17h9.762c1.69 0 2.618-1.967 1.544-3.271l-4.881-5.927a2 2 0 0 0-3.088 0l-4.88 5.927Z" clip-rule="evenodd"/>
                                                </svg>
                                            }
                                        </button>
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    <div className="flex items-center">
                                        Endereço
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    <div className="flex items-center">
                                        Telefone
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    <div className="flex items-center">
                                        Faixa IP
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    <div className="flex items-center">
                                        Status
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    <div className="flex items-center">
                                        Ativo
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    <span className="sr-only">Edit</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                locais.length > 0 ?
                                locais.map((item) => (
                                    <tr key={item.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            {(item.apelido != null && item.apelido != '') ? item.apelido : item.nome}
                                        </th>
                                        <td className="px-6 py-4">
                                            {item.endereco}
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.telefone_1}
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.faixa_ip}
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusDot status={item.status} />
                                        </td>
                                        <td className="px-6 py-4">
                                            <label className="inline-flex items-center cursor-pointer">
                                                <input type="checkbox" checked={item.ativo} onChange={(event) => handleAtivo(event, item.id, event.target.checked)} className="sr-only peer" />
                                                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                                            </label>
                                        </td>
                                        <td className="px-0 py-4 text-right flex">
                                            <button onClick={() => handleView(item)} className="cursor-pointer font-medium text-blue-600 dark:text-blue-500 hover:underline me-2">
                                                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                    <path stroke="currentColor" stroke-width="2" d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z"/>
                                                    <path stroke="currentColor" stroke-width="2" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                                                </svg>
                                            </button>
                                            <Link href={ `/locais/editar/${item.id}` } className="font-medium text-blue-600 dark:text-blue-500 hover:underline me-2">
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
                                    <td className="px-6 py-4 text-center" colSpan={6}>Nenhum Local cadastrado!</td>
                                </tr>
                            }
                        </tbody>
                    </table>
                </div>
                <nav aria-label="Page navigation example" className="flex justify-center items-center mt-6">
                    <ul className="flex items-center -space-x-px h-8 text-sm">
                        <li>
                            <button onClick={goToPreviousPage} className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                                <span className="sr-only">Previous</span>
                                <svg className="w-2.5 h-2.5 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 1 1 5l4 4"/>
                                </svg>
                            </button>
                        </li>
                        {(() => {
                            const pageNumbers = [];
                            const visiblePageCount = 5;
                            let startPage = Math.max(1, currentPage - Math.floor(visiblePageCount / 2));
                            let endPage = Math.min(totalPages, currentPage + Math.floor(visiblePageCount / 2));

                            if (endPage - startPage + 1 < visiblePageCount) {
                                if (startPage === 1) {
                                    endPage = Math.min(totalPages, visiblePageCount);
                                } else {
                                    startPage = Math.max(1, totalPages - visiblePageCount + 1);
                                }
                            }

                            if (startPage > 1) {
                                pageNumbers.push(
                                    <li key={1}>
                                        <button
                                            onClick={() => goToPage(1)}
                                            className={`flex items-center justify-center px-3 h-8 leading-tight ${
                                                currentPage === 1
                                                    ? "z-10 text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                                                    : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                            }`}
                                        >
                                            1
                                        </button>
                                    </li>
                                );
                                if (startPage > 2) {
                                    pageNumbers.push(<li key="ellipsis-start"><span className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">...</span></li>);
                                }
                            }

                            for (let i = startPage; i <= endPage; i++) {
                                pageNumbers.push(
                                    <li key={i}>
                                        <button
                                            onClick={() => goToPage(i)}
                                            className={`flex items-center justify-center px-3 h-8 leading-tight ${
                                                currentPage === i
                                                    ? "z-10 text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                                                    : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                            }`}
                                        >
                                            {i}
                                        </button>
                                    </li>
                                );
                            }

                            if (endPage < totalPages) {
                                if (endPage < totalPages - 1) {
                                    pageNumbers.push(<li key="ellipsis-end"><span className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">...</span></li>);
                                }
                                pageNumbers.push(
                                    <li key={totalPages}>
                                        <button
                                            onClick={() => goToPage(totalPages)}
                                            className={`flex items-center justify-center px-3 h-8 leading-tight ${
                                                currentPage === totalPages
                                                    ? "z-10 text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                                                    : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                            }`}
                                        >
                                            {totalPages}
                                        </button>
                                    </li>
                                );
                            }

                            return pageNumbers;
                        })()}
                        <li>
                            <button onClick={goToNextPage} className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                                <span className="sr-only">Next</span>
                                <svg className="w-2.5 h-2.5 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
                                </svg>
                            </button>
                        </li>
                    </ul>
                </nav>
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
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Deseja realmente deletar este Local?</h3>
                        <button data-modal-hide="popup-modal" type="button" onClick={() => handleDelete(item)} className="cursor-pointer text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">
                            Sim
                        </button>
                        <button data-modal-hide="popup-modal" type="button" onClick={() => handleCancelar()} className="cursor-pointer py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Não</button>
                    </div>
                </div>
            </div>
        </div>

        <LocaisView item={dados} view={view} fechar={() => setView(false)} />

        </>
    );
}