'use client';

import LoadingSpinner from "@/components/loading/loadingSpinner";
import { normalizar } from "@/lib/string";
import { Local } from "@/types/locais";
import { Ramal } from "@/types/ramal";
import { useEffect, useState } from "react";

const ITEMS_PER_PAGE = 20;

export default function RamalList() {
    const [loading, setLoading] = useState(false);

    const [locais, setLocais] = useState<Local[]>([]);
    const [selectedLocal, setSelectedLocal] = useState<number>();

    const [ramais, setRamais] = useState<Ramal[]>([]);

    const handleLoadLocais = async () => {
        try {
            const response = await fetch('/api/lista-ramal/unidades');

            if (response.ok) {
                const data = await response.json();
                setLocais(data.response);
                setSelectedLocal(data.response[0].id);
            }
        } catch (err) {
            console.error(err);
        } finally {
            //
        }
    };

    const handleLoad = async () => {
        try {
            const response = await fetch(`/api/lista-ramal/ramais?local=${selectedLocal}`);
            if (!response.ok) {
                throw new Error(`Erro ao buscar ramais: ${response.status} - ${response.statusText}`);
            }
            const data = await response.json();
            setRamais(data.response);
        } catch (err: any) {
            console.log(err.message);
        } finally {
            //
        }
    };

    useEffect(() => {
        if (locais.length > 0)
            handleLoad();
    }, [locais, selectedLocal]);

    useEffect(() => {
        

        const loadData = async () => {
            setLoading(true);
            await handleLoadLocais();
            await handleLoad();
            setLoading(false);
        };

        loadData();
    }, []);

    const [gerandoFolha, setGerandoFolha] = useState(false);
    const gerarFolha = async () => {
        try {
            setGerandoFolha(true);

            const response = await fetch(`${process.env.NEXT_PUBLIC_PYTHON_API_URL}/folha-ramal?local=${selectedLocal}`);

            if (!response.ok) {
                console.log(response.statusText);
                throw new Error("Erro ao gerar a Folha de Ramal.");
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
            setGerandoFolha(false);
        }
    }

    const [searchTerm, setSearchTerm] = useState("");
    const handleSearch = (term: string) => {
        setSearchTerm(term);
    };

    // Lógica de filtragem
    const dadosFiltrados = ramais.filter(item => {
        const termo = normalizar(searchTerm.toLowerCase());
        const nome = item.nome ? normalizar(item.nome.toLowerCase()) : '';
        const departamento = item.setor ? normalizar(item.setor.toLowerCase()) : '';
        const numero = item.numero ? item.numero : '';

        return nome.includes(termo) || departamento.includes(termo) || numero.includes(termo);
    });

    // Lógica de ordenação
    const [field, setField] = useState('');
    const [order, setOrder] = useState('');

    let dadosOrdenados = dadosFiltrados;

    if (order === 'asc' || order === 'desc') {
        dadosOrdenados = [...dadosFiltrados].sort((a, b) => {
            const nomeA = a.nome.toLowerCase();
            const nomeB = b.nome.toLowerCase();
            const departamentoA = a.setor.toLowerCase();
            const departamentoB = b.setor.toLowerCase();
            const numeroA = a.numero.toLowerCase();
            const numeroB = b.numero.toLowerCase();

            if (order === 'asc') {
                return field === 'nome' ? nomeA.localeCompare(nomeB) :
                    field === 'departamento' ? departamentoA.localeCompare(departamentoB) :
                    numeroA.localeCompare(numeroB);
            } else {
                return field === 'nome' ? nomeB.localeCompare(nomeA) :
                    field === 'departamento' ? departamentoB.localeCompare(departamentoA) :
                    numeroB.localeCompare(numeroA);
            }
        });
    }

    const handleOrder = (sField: string) => {
        setField(sField);
        if (order == '') {
            setOrder('asc');
        } else if (order == 'asc') {
            setOrder('desc');
        } else {
            setOrder('asc');
        }
    };

    // Lógica de paginação
    const [currentPage, setCurrentPage] = useState(1);
    const inicio = (currentPage - 1) * ITEMS_PER_PAGE;
    const fim = inicio + ITEMS_PER_PAGE;
    const dadosPaginados = dadosOrdenados.slice(inicio, fim);
    const totalPages = Math.ceil(dadosFiltrados.length / ITEMS_PER_PAGE);

    const goToPreviousPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const goToNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    const goToPage = (pageNumber: number) => {
        setCurrentPage(Math.max(1, Math.min(pageNumber, totalPages)));
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="flex h-screen justify-center">
            <div className="container px-10 py-6">
                <div className="flex justify-end w-full mb-2 space-x-4">
                    <select className="bg-white dark:bg-gray-800 border rounded-lg py-2 px-3 max-h-10 text-sm outline-none focus:border-blue-500" name="local" id="local" value={selectedLocal} onChange={(e) => setSelectedLocal(Number(e.target.value))}>
                        {
                            locais.map(item => (
                                <option key={item.id} value={item.id}>{item.apelido ? item.apelido : item.nome}</option>
                            ))
                        }
                    </select>
                    <input onChange={(e) => handleSearch(e.target.value)} className="bg-white dark:bg-gray-800 border rounded-lg w-1/2 py-2 px-3 max-h-10 text-sm outline-none focus:border-blue-500" type="text" name="search" id="search" placeholder="Informe sua pesquisa aqui..." />
                    <div className="flex space-x-2">
                        {
                            gerandoFolha ?
                            <div role="status" className="flex justify-center">
                                <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/></svg>
                                <span className="sr-only">Loading...</span>
                            </div>
                            :
                            <button onClick={gerarFolha} disabled={gerandoFolha} className="cursor-pointer border px-1.5 rounded-lg border-blue-700 bg-blue-700 hover:bg-blue-800 hover:border-blue-800 transition ease-in-out duration-100">
                                <svg className="w-6 h-6 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                    <path fill-rule="evenodd" d="M9 7V2.221a2 2 0 0 0-.5.365L4.586 6.5a2 2 0 0 0-.365.5H9Zm2 0V2h7a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9h5a2 2 0 0 0 2-2Zm2-2a1 1 0 1 0 0 2h3a1 1 0 1 0 0-2h-3Zm0 3a1 1 0 1 0 0 2h3a1 1 0 1 0 0-2h-3Zm-6 4a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-6Zm8 1v1h-2v-1h2Zm0 3h-2v1h2v-1Zm-4-3v1H9v-1h2Zm0 3H9v1h2v-1Z" clip-rule="evenodd"/>
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
                                        Nº
                                        <button className="cursor-pointer" onClick={() => handleOrder('numero')}>
                                            {
                                                field != 'numero' &&
                                                <svg className="w-3 h-3 ms-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z"/>
                                                </svg>
                                            }
                                            {
                                                order == 'asc' && field == 'numero' &&
                                                <svg className="w-3 h-3 ms-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                                    <path fill-rule="evenodd" d="M18.425 10.271C19.499 8.967 18.57 7 16.88 7H7.12c-1.69 0-2.618 1.967-1.544 3.271l4.881 5.927a2 2 0 0 0 3.088 0l4.88-5.927Z" clip-rule="evenodd"/>
                                                </svg>
                                            }
                                            {
                                                order == 'desc' && field == 'numero' &&
                                                <svg className="w-3 h-3 ms-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                                    <path fill-rule="evenodd" d="M5.575 13.729C4.501 15.033 5.43 17 7.12 17h9.762c1.69 0 2.618-1.967 1.544-3.271l-4.881-5.927a2 2 0 0 0-3.088 0l-4.88 5.927Z" clip-rule="evenodd"/>
                                                </svg>
                                            }
                                        </button>
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    <div className="flex items-center">
                                        Nome
                                        <button className="cursor-pointer" onClick={() => handleOrder('nome')}>
                                            {
                                                field != 'nome' &&
                                                <svg className="w-3 h-3 ms-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z"/>
                                                </svg>
                                            }
                                            {
                                                order == 'asc' && field == 'nome' &&
                                                <svg className="w-3 h-3 ms-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                                    <path fill-rule="evenodd" d="M18.425 10.271C19.499 8.967 18.57 7 16.88 7H7.12c-1.69 0-2.618 1.967-1.544 3.271l4.881 5.927a2 2 0 0 0 3.088 0l4.88-5.927Z" clip-rule="evenodd"/>
                                                </svg>
                                            }
                                            {
                                                order == 'desc' && field == 'nome' &&
                                                <svg className="w-3 h-3 ms-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                                    <path fill-rule="evenodd" d="M5.575 13.729C4.501 15.033 5.43 17 7.12 17h9.762c1.69 0 2.618-1.967 1.544-3.271l-4.881-5.927a2 2 0 0 0-3.088 0l-4.88 5.927Z" clip-rule="evenodd"/>
                                                </svg>
                                            }
                                        </button>
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    <div className="flex items-center">
                                        Depto.
                                        <button className="cursor-pointer" onClick={() => handleOrder('departamento')}>
                                            {
                                                field != 'departamento' &&
                                                <svg className="w-3 h-3 ms-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z"/>
                                                </svg>
                                            }
                                            {
                                                order == 'asc' && field == 'departamento' &&
                                                <svg className="w-3 h-3 ms-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                                    <path fill-rule="evenodd" d="M18.425 10.271C19.499 8.967 18.57 7 16.88 7H7.12c-1.69 0-2.618 1.967-1.544 3.271l4.881 5.927a2 2 0 0 0 3.088 0l4.88-5.927Z" clip-rule="evenodd"/>
                                                </svg>
                                            }
                                            {
                                                order == 'desc' && field == 'departamento' &&
                                                <svg className="w-3 h-3 ms-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                                    <path fill-rule="evenodd" d="M5.575 13.729C4.501 15.033 5.43 17 7.12 17h9.762c1.69 0 2.618-1.967 1.544-3.271l-4.881-5.927a2 2 0 0 0-3.088 0l-4.88 5.927Z" clip-rule="evenodd"/>
                                                </svg>
                                            }
                                        </button>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                dadosPaginados.length > 0 ?
                                dadosPaginados.map((item) => (
                                    <tr key={item.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            {item.numero}
                                        </th>
                                        <td className="px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                                            {item.nome}
                                        </td>
                                        <td className="px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                                            {item.setor}
                                        </td>
                                    </tr>
                                ))
                                :
                                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                                    <td className="px-6 py-4 text-center" colSpan={5}>Nenhum Ramal cadastrado!</td>
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
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4"/>
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
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                                </svg>
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
}