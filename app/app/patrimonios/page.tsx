"use client";

import MultiSelect from "@/components/multiSelect";
import PatrimoniosView from "@/components/views/patrimoniosView";
import ReportConfig from "@/components/reportConfig";
import Link from "next/link";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Transferencia from "@/components/transferencia";
import Baixa from "@/components/modal/baixa";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { normalizar } from "@/lib/string";
import LoadingSpinner from "@/components/loading/loadingSpinner";
import ImportarFotos from "@/components/modal/importarFotos";
import { Button } from "@/components/ui/button";
import Alert from "@/components/alert";
import SelectedsCounter from "@/components/selectedsCounter";

import { FaSearch } from "react-icons/fa";
import { LuDownload } from "react-icons/lu";
import Baixas from "@/components/views/baixas";

interface Patrimonio {
    id: string;
    tipo: number;
    descricao: string;
    num_patrimonio: number;
    orgao_patrimonio: string;
    local: number;
    tipo_fk: Tipo;
}

interface Tipo {
    nome: string;
}

interface Option {
    value: number;
    label: string;
}

interface CheckedItems {
    [id: string]: boolean;
}

const ITEMS_PER_PAGE = 50;

export default function Patrimonios() {
    const [patrimonios, setPatrimonios] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletar, setDeletar] = useState(false);
    const [item, setItem] = useState(0);

    const [message, setMessage] = useState('');
    const [alertType, setAlertType] = useState<'success' | 'error' | 'warning' | 'default' | 'secondary' | undefined>();
    const handleClose = () => setMessage("");

    const [count, setCount] = useState(0);

    const [view, setView] = useState(false);
    const [dados, setDados] = useState<Patrimonio>();

    const [transferir, setTransferir] = useState(false);
    const [localAtual, setLocalAtual] = useState({
        titulo: '',
        localId: 0,
        id: 0,
        nome: '',
    });

    const [currentPage, setCurrentPage] = useState(1);

    const [searchTerm, setSearchTerm] = useState('');

    const [order, setOrder] = useState('');
    const [by, setBy] = useState('');

    const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);

    const handleView = (item: any) => {
        setDados(item);
        setView(true);
    };

    const handleTransferir = (item: any) => {
        setLocalAtual({
            titulo: `${item.tipo_fk.nome} ${item.descricao ?? ''} - ${item.num_patrimonio} ${item.orgao_patrimonio}`,
            id: item.id,
            localId: item.local,
            nome: item.local_fk.nome,
        });
        setTransferir(true);
    };

    // VER BAIXAS ===========================================================================
    const [baixasIsOpen, setBaixasIsOpen] = useState<boolean>(false);
    // FIM VER BAIXAS =======================================================================

    // Baixa de Patrimônio
    const [itensBaixas, setItensBaixa] = useState<Patrimonio[]>();
    const [baixa, setBaixa] = useState(false);

    const [checkedItems, setCheckedItems] = useState<CheckedItems>({});
    const [selecao, setSelecao] = useState<Patrimonio[]>([]);

    const handleCheckboxChange = (id: string) => {
        setCheckedItems(prev => ({
            ...prev,
            [id]: !prev[id], // Inverte o estado atual
        }));
    };

    const selecionarPatrimonio = (patrimonio: Patrimonio, status: boolean) => {
        handleCheckboxChange(patrimonio.id);
        if (status) {
            setSelecao([
                ...selecao,
                patrimonio,
            ]);
        } else {
            setSelecao(prevSelecionados => prevSelecionados.filter(
                (f) => f.id != patrimonio.id
            ));
        }
    };

    const handleBaixou = () => {
        setMessage("Baixa registrada com sucesso!");
        setAlertType("success");
        handleReload();
    };

    const handleLimpar = () => {
        setSelecao([]);
        setCheckedItems({});
    };
    // FIM Baixa de Patrimônio

    // IMPORTAÇÃO DE FOTOS
    const [itemFoto, setItemFoto] = useState<any>(null);
    const [fotos, setFotos] = useState(false);

    const handleFotos = (item: any) => {
        setItemFoto(item);
        setFotos(true);
    };
    // FIM IMPORTAÇÃO DE FOTOS

    const [options, setOptions] = useState<Option[]>([]);

    const { data: session, status } = useSession();
    const router = useRouter();
    
    useEffect(() => {
        const storedMessage = sessionStorage.getItem('message');
        if (storedMessage) {
            setAlertType('success');
            setMessage(storedMessage);
            sessionStorage.removeItem('message');
        }
    }, []);

    const handleTipos = async () => {
        try {
            const response = await fetch(`/api/tipos`);

            const data = await response.json();

            if (response.ok) {
                const tipos: Option[] = [];
                data.response.forEach((tipo: { id: number; nome: string; }) => {
                    tipos.push({
                        value: tipo.id,
                        label: tipo.nome,
                    });
                });
                setOptions(tipos);
            }
        } catch (err) {
            //
        }
    };

    const handleReload = useCallback(async () => {
        setLoading(true);
        try {
            const arrStr = selectedOptions.map(item => `${encodeURIComponent(item.value)}`).join(',');

            const response = await fetch(
                //`/api/patrimonios?page=${currentPage}&limit=${ITEMS_PER_PAGE}${searchTerm ? `&searchTerm=${searchTerm}` : ''}${arrStr ? `&options=${arrStr}` : ''}${order != '' ? `&order=${order}` : ''}${by != '' ? `&by=${by}` : ''}`
                '/api/patrimonios'
            );
            if (!response.ok) {
                throw new Error(`Erro ao buscar patrimônios: ${response.status} - ${response.statusText}`);
            }
            const data = await response.json();
            setPatrimonios(data.response);
            setCount(data.count);

            setLoading(false);
        } catch (err: any) {
            console.log(err.message);
        } finally {
            //
        }
    }, []);

    useEffect(() => {
        handleReload();
        handleTipos();
    }, [handleReload]);

    // Lógica de filtragem (pesquisa)
    const [baixados, setBaixados] = useState(false);

    const selectedIds = new Set(selectedOptions.map(opt => opt.value));

    const dadosFiltrados = patrimonios.filter(item => {
        const termo = normalizar(searchTerm.toLowerCase());
        const num_patrimonio = item.num_patrimonio ? item.num_patrimonio.toString().padStart(7, '0') : '';
        const orgao_patrimonio = item.orgao_patrimonio ? normalizar(item.orgao_patrimonio.toLowerCase()) : '';
        const descricao = item.descricao ? normalizar(item.descricao.toLowerCase()) : '';
        const nomeLocal = item.local_fk.nome ? normalizar(item.local_fk.nome.toLowerCase()) : '';
        const apelidoLocal = item.local_fk.apelido ? normalizar(item.local_fk.apelido.toLowerCase()) : '';

        const coincideTxt = descricao.includes(termo) || nomeLocal.includes(termo) || apelidoLocal.includes(termo) ||
            num_patrimonio.includes(termo) || orgao_patrimonio.includes(termo);

        const coincideTipo = selectedIds.size === 0 || selectedIds.has(item.tipo);

        const coincideBaixados = !baixados || item.baixado === true;

        return coincideTxt && coincideTipo && coincideBaixados;
    });

    // Lógica de ordenação
    let dadosOrdenados = dadosFiltrados;

    if (order === 'asc' || order === 'desc') {
        dadosOrdenados = [...dadosFiltrados].sort((a, b) => {
            const patrimonioA = a.num_patrimonio ?? 0;
            const patrimonioB = b.num_patrimonio ?? 0;

            return order === 'asc' ?
                patrimonioA - patrimonioB :
                patrimonioB - patrimonioA;
        });
    }

    // Lógica de paginação
    const inicio = (currentPage - 1) * ITEMS_PER_PAGE;
    const fim = inicio + ITEMS_PER_PAGE;
    const dadosPaginados = dadosOrdenados.slice(inicio, fim);
    const totalPages = Math.ceil(dadosFiltrados.length / ITEMS_PER_PAGE);

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
                const response = await fetch('/api/patrimonios', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id: id }),
                });
    
                const result = await response.json();
    
                if (response.ok) {
                    setMessage("Patrimônio deletado com sucesso!");
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

    const handleAtivo = async (event: ChangeEvent<HTMLInputElement>, id: number, ativo: boolean) => {
        //console.log(id);
        try {
            const response = await fetch('/api/patrimonios', {
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
        setCurrentPage(1);
    };

    const handleChange = (selected: any) => {
        setSelectedOptions(selected);
        setCurrentPage(1);
    };

    const handleExcel = async () => {
        try {
            const response = await fetch(`/api/patrimonios/relatorio?tipo=excel`);

            if (response.ok) {
                const blob = await response.blob();

                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'relatorio-patrimonios.xlsx';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);

                setMessage('Relatório gerado com sucesso!');
                setAlertType('success');
            } else {
                //
            }
        } catch (err) {
            //
        }
    };

    const [pdf, setPdf] = useState(false);

    const handlePdf = () => {
        setPdf(true);
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

    const handleTransferiu = () => {
        setMessage("Transferência efetuada com sucesso!");
        setAlertType("success");
        handleReload();
    };

    if (loading) return <LoadingSpinner />;

    return (
        <>
        <div className="flex justify-center p-10 ms-12 border">
            <div className="max-w-4xl xl:container">
                <div className={`${message ? 'grid grid-cols-2' : 'flex justify-end'} items-center mb-2`}>
                    <Alert type={alertType} onClose={handleClose}>{message}</Alert>
                    <Link href={ `/patrimonios/cadastrar` } className="justify-self-end text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-semibold rounded-lg text-xs uppercase px-5 py-2.5 focus:outline-none dark:focus:ring-blue-800 transition ease-in-out duration-100">Cadastrar</Link>
                </div>
                <div className="flex w-full mb-2 space-x-4">
                    <MultiSelect msStyle={'w-1/2'} placeholder="Selecione o tipo..." options={options} selectedOptions={selectedOptions} onChange={handleChange} />
                    <input onChange={(e) => handleSearch(e.target.value)} className="border rounded-lg w-1/2 py-2 px-3 max-h-10 text-sm outline-none focus:border-blue-500 bg-white dark:bg-gray-800" type="text" name="search" id="search" placeholder="Informe sua pesquisa aqui..." />
                    <div className="flex space-x-2 items-center">
                        {/* <button onClick={handleExcel} className="h-full cursor-pointer border px-1.5 rounded-lg border-blue-700 bg-blue-700 hover:bg-blue-800 hover:border-blue-800 transition ease-in-out duration-100">
                            <svg className="w-6 h-6 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                <path fill-rule="evenodd" d="M9 7V2.221a2 2 0 0 0-.5.365L4.586 6.5a2 2 0 0 0-.365.5H9Zm2 0V2h7a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9h5a2 2 0 0 0 2-2Zm2-2a1 1 0 1 0 0 2h3a1 1 0 1 0 0-2h-3Zm0 3a1 1 0 1 0 0 2h3a1 1 0 1 0 0-2h-3Zm-6 4a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-6Zm8 1v1h-2v-1h2Zm0 3h-2v1h2v-1Zm-4-3v1H9v-1h2Zm0 3H9v1h2v-1Z" clip-rule="evenodd"/>
                            </svg>
                        </button> */}
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <Button style={{ "cursor": "pointer" }}>
                                    Opções
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={handlePdf} style={{ "cursor": "pointer" }}>
                                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                        <path fill-rule="evenodd" d="M9 2.221V7H4.221a2 2 0 0 1 .365-.5L8.5 2.586A2 2 0 0 1 9 2.22ZM11 2v5a2 2 0 0 1-2 2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2 2 2 0 0 0 2 2h12a2 2 0 0 0 2-2 2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2V4a2 2 0 0 0-2-2h-7Zm-6 9a1 1 0 0 0-1 1v5a1 1 0 1 0 2 0v-1h.5a2.5 2.5 0 0 0 0-5H5Zm1.5 3H6v-1h.5a.5.5 0 0 1 0 1Zm4.5-3a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h1.376A2.626 2.626 0 0 0 15 15.375v-1.75A2.626 2.626 0 0 0 12.375 11H11Zm1 5v-3h.375a.626.626 0 0 1 .625.626v1.748a.625.625 0 0 1-.626.626H12Zm5-5a1 1 0 0 0-1 1v5a1 1 0 1 0 2 0v-1h1a1 1 0 1 0 0-2h-1v-1h1a1 1 0 1 0 0-2h-2Z" clip-rule="evenodd"/>
                                    </svg>
                                    Gerar relatório
                                </DropdownMenuItem>
                                <DropdownMenuItem style={{ "cursor": "pointer" }} onClick={() => setBaixados(prev => !prev)}>
                                    { baixados ? 'Exibir todos' : 'Exibir baixados' }
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setBaixasIsOpen(true)} variant="warning" className="cursor-pointer">
                                    <FaSearch />
                                    Ver Baixas
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => {if (selecao.length > 0) setBaixa(true); else {setMessage("Selecione pelo menos um patrimônio.");setAlertType('warning');}}} variant="destructive" className="cursor-pointer">
                                    <LuDownload />
                                    Registrar Baixa
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3 w-8"></th>
                                <th scope="col" className="px-6 py-3">
                                    <div className="flex items-center">
                                        Nº
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
                                        Tipo
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    <div className="flex items-center">
                                        Descrição
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    <div className="flex items-center">
                                        Orgão
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    <div className="flex items-center">
                                        Unidade
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
                                dadosPaginados.length > 0 ?
                                dadosPaginados.map((item) => (
                                    <tr key={item.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                                        <td className="px-6 py-4">
                                            <input id="default-checkbox" type="checkbox" value="" checked={checkedItems[item.id] || false} onChange={(e) => selecionarPatrimonio(item, e.target.checked)} disabled={item.baixado} className={`${item.baixado ? 'cursor-not-allowed' : 'cursor-pointer'} w-4 h-4 text-blue-600 bg-white border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-800 dark:border-gray-600`} />
                                        </td>
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            { item.num_patrimonio ? item.num_patrimonio.toString().padStart(7, '0') : '' }
                                        </th>
                                        <td className="px-6 py-4">
                                            {item.tipo_fk.nome}
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.descricao}
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.orgao_patrimonio}
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.local_fk ? (item.local_fk.apelido ? item.local_fk.apelido : item.local_fk.nome) : ''}
                                        </td>
                                        <td className="px-6 py-4">
                                            <label className={`inline-flex items-center ${item.baixado ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                                                <input type="checkbox" disabled={item.baixado} checked={item.ativo} onChange={(event) => handleAtivo(event, item.id, event.target.checked)} className="sr-only peer" />
                                                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                                            </label>
                                        </td>
                                        <td className="px-0 py-4 text-right flex">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger>
                                                    <Button style={{ "cursor": "pointer" }}>
                                                        {/* <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                            <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M6 12h.01m6 0h.01m5.99 0h.01"/>
                                                        </svg> */}
                                                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13v-2a1 1 0 0 0-1-1h-.757l-.707-1.707.535-.536a1 1 0 0 0 0-1.414l-1.414-1.414a1 1 0 0 0-1.414 0l-.536.535L14 4.757V4a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v.757l-1.707.707-.536-.535a1 1 0 0 0-1.414 0L4.929 6.343a1 1 0 0 0 0 1.414l.536.536L4.757 10H4a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h.757l.707 1.707-.535.536a1 1 0 0 0 0 1.414l1.414 1.414a1 1 0 0 0 1.414 0l.536-.535 1.707.707V20a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-.757l1.707-.708.536.536a1 1 0 0 0 1.414 0l1.414-1.414a1 1 0 0 0 0-1.414l-.535-.536.707-1.707H20a1 1 0 0 0 1-1Z"/>
                                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
                                                        </svg>
                                                        {/* <DropdownMenu.TriggerIcon /> */}
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <DropdownMenuItem onClick={() => handleView(item)} style={{ "cursor": "pointer" }}>
                                                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                            <path stroke="currentColor" stroke-width="2" d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z"/>
                                                            <path stroke="currentColor" stroke-width="2" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                                                        </svg>
                                                        Visualizar
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem disabled={item.baixado} hidden={item.baixado} onClick={() => handleTransferir(item)} style={{ "cursor": "pointer" }}>
                                                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m16 10 3-3m0 0-3-3m3 3H5v3m3 4-3 3m0 0 3 3m-3-3h14v-3"/>
                                                        </svg>
                                                        Transferir
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => window.location.href = `/patrimonios/editar/${item.id}`} style={{ "cursor": "pointer" }}>
                                                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"/>
                                                        </svg>
                                                        Editar
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleFotos(item)} style={{ "cursor": "pointer" }}>
                                                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m3 16 5-7 6 6.5m6.5 2.5L16 13l-4.286 6M14 10h.01M4 19h16a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Z"/>
                                                        </svg>
                                                        Imagens
                                                    </DropdownMenuItem>
                                                    {/* <DropdownMenuItem className="cursor-pointer" variant="warning" disabled={item.baixado} hidden={item.baixado} onClick={() => handleBaixa(item)}>
                                                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 15v2a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-2m-8 1V4m0 12-4-4m4 4 4-4"/>
                                                        </svg>
                                                        Baixa
                                                    </DropdownMenuItem> */}
                                                    <DropdownMenuItem variant="destructive" onClick={() => handleConfirmar(item.id)} style={{ "cursor": "pointer" }}>
                                                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/>
                                                        </svg>
                                                        Deletar
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))
                                :
                                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                                    <td className="px-6 py-4 text-center" colSpan={8}>Nenhum Patrimônio cadastrado!</td>
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
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Deseja realmente deletar este Patrimônio?</h3>
                        <button data-modal-hide="popup-modal" type="button" onClick={() => handleDelete(item)} className="cursor-pointer text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">
                            Sim
                        </button>
                        <button data-modal-hide="popup-modal" type="button" onClick={() => handleCancelar()} className="cursor-pointer py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Não</button>
                    </div>
                </div>
            </div>
        </div>

        <PatrimoniosView item={dados} view={view} fechar={() => setView(false)} />
        <Transferencia item={localAtual} show={transferir} close={() => setTransferir(false)} reload={handleTransferiu} />
        <ReportConfig view={pdf} fechar={() => setPdf(false)} />
        <ImportarFotos item={itemFoto} show={fotos} close={() => setFotos(false)} />

        <SelectedsCounter count={selecao.length} limpar={handleLimpar} />

        <Baixas isOpen={baixasIsOpen} onClose={() => setBaixasIsOpen(false)} />
        <Baixa itens={selecao} isOpen={baixa} close={() => setBaixa(false)} reload={handleBaixou} />

        </>
    );
}