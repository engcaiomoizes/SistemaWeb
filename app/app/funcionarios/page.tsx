"use client";

import HTML2Canvas from "@/components/html2canvas";
import { getCurrentMonth, getCurrentYear, normalizar } from "@/lib/string";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Funcionario } from "@/types/funcionario";
import FuncionariosPDF, { PDFRef } from "@/components/pdf/funcionarios";
import FolhaCustom from "@/components/modal/folhaCustom";
import LoadingSpinner from "@/components/loading/loadingSpinner";
import FuncionarioView from "@/components/views/funcionario";
import Alert from "@/components/alert";

const ITEMS_PER_PAGE = 50;

interface CheckedItems {
    [id: string]: boolean;
}

export default function Funcionarios() {
    const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletar, setDeletar] = useState(false);
    const [item, setItem] = useState("");

    const [message, setMessage] = useState('');
    const [alertType, setAlertType] = useState<'success' | 'error' | 'warning' | 'default' | 'secondary' | undefined>();
    const handleClose = () => setMessage("");

    const [count, setCount] = useState(0);
    
    const [currentPage, setCurrentPage] = useState(1);
    
    const [searchTerm, setSearchTerm] = useState('');

    const [order, setOrder] = useState('');

    // Configuração da Folha de Ponto
    const [hidden, setHidden] = useState(true);
    const [selecao, setSelecao] = useState<Funcionario[]>([]);
    const [selecionados, setSelecionados] = useState<Funcionario[]>([]);
    const [ano, setAno] = useState(getCurrentYear());
    const [mes, setMes] = useState(getCurrentMonth());
    const [title, setTitle] = useState("documento");
    const childRef = useRef<PDFRef>(null);

    const [checkedItems, setCheckedItems] = useState<CheckedItems>({});

    const handleCheckboxChange = (id: string) => {
        setCheckedItems(prev => ({
            ...prev,
            [id]: !prev[id], // Inverte o estado atual
        }));
    };

    // Configuração Folha Custom
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const storedMessage = sessionStorage.getItem('message');
        if (storedMessage) {
            setAlertType('success');
            setMessage(storedMessage);
            sessionStorage.removeItem('message');
        }
    }, []);

    const handleReload = useCallback(async () => {
        try {
            const response = await fetch(
                // `/api/funcionarios?page=${currentPage}&limit=${ITEMS_PER_PAGE}${searchTerm ? `&searchTerm=${searchTerm}` : ''}${order != '' ? `&order=${order}` : ''}`
                '/api/funcionarios'
            );
            if (!response.ok) {
                throw new Error(`Erro ao buscar funcionarios: ${response.status} - ${response.statusText}`);
            }
            const data = await response.json();
            setFuncionarios(data.response);
            setCount(data.count);

            //setTotalPages(Math.ceil(count / ITEMS_PER_PAGE));
            //console.log(data);
            setLoading(false);
        } catch (err: any) {
            console.log(err.message);
        } finally {
            //
        }
    }, []);

    useEffect(() => {
        handleReload();
    }, [handleReload]);

    // Lógica de filtragem (pesquisa)
    const dadosFiltrados = funcionarios.filter(item => {
        const termo = normalizar(searchTerm.toLowerCase());
        const nome = item.nome ? normalizar(item.nome.toLowerCase()) : '';
        const matricula = item.matricula ? normalizar(item.matricula.toLowerCase()) : '';

        return nome.includes(termo) || matricula.replace(/[^a-zA-Z0-9]/g, '').startsWith(termo);
    });

    // Lógica de ordenação
    let dadosOrdenados = dadosFiltrados;

    if (order === 'asc' || order === 'desc') {
        dadosOrdenados = [...dadosFiltrados].sort((a, b) => {
            const nomeA = a.nome.toLowerCase();
            const nomeB = b.nome.toLowerCase();
    
            if (order === 'asc') {
                return nomeA.localeCompare(nomeB); // Ordenação A-Z
            } else {
                return nomeB.localeCompare(nomeA); // Ordenação Z-A
            }
        });
    }

    // Lógica de paginação
    const inicio = (currentPage - 1) * ITEMS_PER_PAGE;
    const fim = inicio + ITEMS_PER_PAGE;
    const dadosPaginados = dadosOrdenados.slice(inicio, fim);
    const totalPages = Math.ceil(dadosFiltrados.length / ITEMS_PER_PAGE);

    const handleConfirmar = (id: string) => {
        setItem(id);
        setDeletar(true);
    };

    const handleCancelar = () => {
        setItem("");
        setDeletar(false);
    };

    const handleDelete = async (id: string) => {
        if (deletar) {
            try {
                const response = await fetch('/api/funcionarios', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id: id }),
                });
    
                const result = await response.json();
    
                if (response.ok) {
                    setMessage("Funcionário deletado com sucesso!");
                    setAlertType('success');
                    handleReload();
                    setItem("");
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

    const gerarFolha = (funcionario: Funcionario) => {
        setSelecionados([funcionario]);
        setTitle(funcionario.nome);
        if (title != "")
            setHidden(false);
    };

    const selecionarFuncionario = (funcionario: Funcionario, status: boolean) => {
        handleCheckboxChange(funcionario.id);
        if (status) {
            setSelecao([
                ...selecao,
                funcionario,
            ]);
        } else {
            setSelecao(prevSelecionados => prevSelecionados.filter(
                (f) => f.id !== funcionario.id));
        }
    };

    const gerarFolhaSelecionados = () => {
        setSelecionados(selecao);
        setHidden(false);
    };

    const gerarListagem = () => {
        childRef.current?.gerarListagem();
    };

    const limparSelecao = () => {
        setSelecao([]);
        setCheckedItems({});
    };

    const [itemView, setItemView] = useState<Funcionario | undefined>();
    const [isView, setIsView] = useState<boolean>(false);

    const handleView = (item: Funcionario) => {
        setItemView(item);
        setIsView(true);
    }

    if (loading) return <LoadingSpinner />;

    return (
        <>
        <div className="flex justify-center p-10 ms-12">
            <div className="container">
            <div className={`${message ? 'grid grid-cols-2' : 'flex justify-end'} items-center mb-2`}>
                    <Alert type={alertType} onClose={handleClose}>{message}</Alert>
                    <Link href={ `/funcionarios/cadastrar` } className="justify-self-end text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-semibold rounded-lg text-xs uppercase px-5 py-2.5 focus:outline-none dark:focus:ring-blue-800 transition ease-in-out duration-100">Cadastrar</Link>
                </div>
                <div className="flex justify-end w-full mb-2 space-x-4">
                    <div className="w-1/2 flex space-x-2 justify-end">
                        <div className={`${selecao.length > 0 ? '' : 'hidden'} flex items-center w-full px-4 rounded-lg bg-teal-500 text-white`}>
                            <span className="font-medium text-lg me-4">{selecao.length} selecionado(s)</span>
                            <button onClick={gerarFolhaSelecionados} className="cursor-pointer uppercase border rounded py-0.5 px-2 bg-white border-white text-teal-500 font-medium hover:bg-teal-500 hover:text-white transition ease-in-out duration-150">Gerar folhas</button>
                            <button onClick={limparSelecao} className="cursor-pointer uppercase border rounded py-0.5 px-2 bg-red-600 border-red-600 text-white font-medium hover:bg-red-700 hover:border-red-700 transition ease-in-out duration-150 ms-1">Limpar seleção</button>
                        </div>
                        <select className="bg-white dark:bg-gray-800 border rounded-lg py-2 px-3 max-h-10 text-sm outline-none focus:border-blue-500" value={mes} onChange={(e) => setMes(Number(e.target.value))} name="month" id="month">
                            <option value={1}>JANEIRO</option>
                            <option value={2}>FEVEREIRO</option>
                            <option value={3}>MARÇO</option>
                            <option value={4}>ABRIL</option>
                            <option value={5}>MAIO</option>
                            <option value={6}>JUNHO</option>
                            <option value={7}>JULHO</option>
                            <option value={8}>AGOSTO</option>
                            <option value={9}>SETEMBRO</option>
                            <option value={10}>OUTUBRO</option>
                            <option value={11}>NOVEMBRO</option>
                            <option value={12}>DEZEMBRO</option>
                        </select>
                        <input className="w-24 bg-white dark:bg-gray-800 border rounded-lg py-2 px-3 max-h-10 text-sm outline-none focus:border-blue-500" type="number" name="year" id="year" value={ano} onChange={(e) => setAno(Number(e.target.value))} maxLength={4} />
                    </div>
                    <input onChange={(e) => handleSearch(e.target.value)} className="bg-white dark:bg-gray-800 border rounded-lg w-1/2 py-2 px-3 max-h-10 text-sm outline-none focus:border-blue-500" type="text" name="search" id="search" placeholder="Informe sua pesquisa aqui..." />
                    <div className="flex space-x-2">
                        <FuncionariosPDF local={null} ref={childRef} />
                        <FolhaCustom isOpen={isOpen} close={() => setIsOpen(false)} mes={mes} ano={ano} funcionarios={funcionarios} />
                        <button onClick={() => setIsOpen(true)} className="cursor-pointer border px-1.5 rounded-lg border-blue-700 bg-blue-700 hover:bg-blue-800 hover:border-blue-800 transition ease-in-out duration-100">
                            <svg className="w-6 h-6 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                <path fill-rule="evenodd" d="M9 7V2.221a2 2 0 0 0-.5.365L4.586 6.5a2 2 0 0 0-.365.5H9Zm2 0V2h7a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9h5a2 2 0 0 0 2-2Zm2-2a1 1 0 1 0 0 2h3a1 1 0 1 0 0-2h-3Zm0 3a1 1 0 1 0 0 2h3a1 1 0 1 0 0-2h-3Zm-6 4a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-6Zm8 1v1h-2v-1h2Zm0 3h-2v1h2v-1Zm-4-3v1H9v-1h2Zm0 3H9v1h2v-1Z" clip-rule="evenodd"/>
                            </svg>
                        </button>
                        <button onClick={gerarListagem} data-tooltip-target="tooltip-default" type="button" className="cursor-pointer border px-1.5 rounded-lg border-blue-700 bg-blue-700 hover:bg-blue-800 hover:border-blue-800 transition ease-in-out duration-100">
                            <svg className="w-6 h-6 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                <path fill-rule="evenodd" d="M9 2.221V7H4.221a2 2 0 0 1 .365-.5L8.5 2.586A2 2 0 0 1 9 2.22ZM11 2v5a2 2 0 0 1-2 2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2 2 2 0 0 0 2 2h12a2 2 0 0 0 2-2 2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2V4a2 2 0 0 0-2-2h-7Zm-6 9a1 1 0 0 0-1 1v5a1 1 0 1 0 2 0v-1h.5a2.5 2.5 0 0 0 0-5H5Zm1.5 3H6v-1h.5a.5.5 0 0 1 0 1Zm4.5-3a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h1.376A2.626 2.626 0 0 0 15 15.375v-1.75A2.626 2.626 0 0 0 12.375 11H11Zm1 5v-3h.375a.626.626 0 0 1 .625.626v1.748a.625.625 0 0 1-.626.626H12Zm5-5a1 1 0 0 0-1 1v5a1 1 0 1 0 2 0v-1h1a1 1 0 1 0 0-2h-1v-1h1a1 1 0 1 0 0-2h-2Z" clip-rule="evenodd"/>
                            </svg>
                        </button>
                        <div id="tooltip-default" role="tooltip" className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-xs opacity-0 tooltip dark:bg-gray-700">
                            Tooltip content
                            <div className="tooltip-arrow" data-popper-arrow></div>
                        </div>
                    </div>
                </div>
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3 w-8"></th>
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
                                        Matrícula
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    <div className="flex items-center">
                                        Cargo/Função
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    <div className="flex items-center">
                                        Sede de serviço
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    <span className="sr-only">Edit</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                dadosPaginados.length > 0 ?
                                dadosPaginados.map((item) => (
                                    <tr key={item.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                                        <td className="px-6 py-4">
                                            <input id="default-checkbox" type="checkbox" value="" checked={checkedItems[item.id] || false} onChange={(e) => selecionarFuncionario(item, e.target.checked)} className="cursor-pointer w-4 h-4 text-blue-600 bg-white border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-800 dark:border-gray-600" />
                                        </td>
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            {item.nome}
                                        </th>
                                        <td className="px-6 py-4">
                                            {item.matricula}
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.cargo}
                                        </td>
                                        <td className="px-6 py-4">
                                            {(item.local_fk?.nome != null && item.local_fk?.apelido != '') ? item.local_fk?.apelido : item.local_fk?.nome}
                                        </td>
                                        <td className="px-0 py-4 text-right flex">
                                            <button onClick={() => handleView(item)} className="cursor-pointer font-medium text-blue-600 dark:text-blue-500 hover:underline me-2">
                                                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                    <path stroke="currentColor" stroke-width="2" d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z"/>
                                                    <path stroke="currentColor" stroke-width="2" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                                                </svg>
                                            </button>
                                            <button onClick={() => gerarFolha(item)} className="cursor-pointer font-medium text-blue-600 dark:text-blue-500 hover:underline me-2" title="Gerar folha de ponto">
                                                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                    <path stroke="currentColor" stroke-linejoin="round" stroke-width="2" d="M16.444 18H19a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h2.556M17 11V5a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v6h10ZM7 15h10v4a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-4Z"/>
                                                </svg>
                                            </button>
                                            <Link href={ `/funcionarios/editar/${item.id}` } className="font-medium text-blue-600 dark:text-blue-500 hover:underline me-2">
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
                                    <td className="px-6 py-4 text-center" colSpan={6}>Nenhum Funcionário cadastrado!</td>
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
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Deseja realmente deletar este Funcionário?</h3>
                        <button data-modal-hide="popup-modal" type="button" onClick={() => handleDelete(item)} className="cursor-pointer text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">
                            Sim
                        </button>
                        <button data-modal-hide="popup-modal" type="button" onClick={() => handleCancelar()} className="cursor-pointer py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Não</button>
                    </div>
                </div>
            </div>
        </div>

        <div className={`${hidden ? 'hidden' : ''} fixed top-0 left-0 z-40`}>
            <div className="fixed bg-black opacity-40 w-full h-full" onClick={() => setHidden(true)}></div>
            <div className="fixed bg-gray-800 shadow-lg p-6 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg max-h-[720px] min-w-96">
                <HTML2Canvas funcionarios={selecionados} ano={ano} mes={mes} title={title} />
            </div>
        </div>

        <FuncionarioView item={itemView} isOpen={isView} close={() => setIsView(false)} />

        </>
    );
}