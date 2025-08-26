import { Patrimonio } from "@/types/patrimonio";
import { useState } from "react";
import Alert from "../alert";
import FormLaudo from "./formLaudo";
import { FaCheckCircle, FaPlusCircle } from "react-icons/fa";
import { Item } from "@radix-ui/react-dropdown-menu";
import { FaCircleXmark } from "react-icons/fa6";

interface Props {
    itens: Patrimonio[];
    isOpen: boolean;
    close: () => void;
    reload: () => void;
}

interface Item {
    descricao: string;
    patrimonio: string;
}

export default function Baixa({
    itens,
    isOpen,
    close,
    reload,
}: Props) {
    //if (!isOpen || itens.length == 0) return;

    const [loading, setLoading] = useState<boolean>(false);

    const [alertType, setAlertType] = useState<'success' | 'error' | 'warning' | 'default' | 'secondary' | undefined>();
    const [message, setMessage] = useState<string>("");
    const handleClose = () => setMessage("");

    const [memorando, setMemorando] = useState<string | undefined>();
    const [observacoes, setObservacoes] = useState<string | undefined>();

    // ITENS SEM PATRIMÔNIO
    const [semPatrimonio, setSemPatrimonio] = useState<Item[]>([]);
    const [addItem, setAddItem] = useState(false);
    const [descricao, setDescricao] = useState("");

    const handleAddItem = () => {
        if (descricao && descricao !== "") {
            setSemPatrimonio([
                ...semPatrimonio,
                {
                    descricao: descricao,
                    patrimonio: "S/N",
                },
            ]);

            setAddItem(false);
            setDescricao("");
        }
    };

    const handleRemoveItem = (index: number) => {
        setSemPatrimonio(prevState => prevState.filter((_, i) => i !== index));
    };

    const handleRegistrar = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/baixas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    memorando,
                    observacoes,
                    patrimoniosId: itens.map(item => item.id),
                    laudo: urlLaudo,
                }),
            });

            if (response.ok) {
                close();
                reload();
            } else {
                setMessage(response.statusText);
                setAlertType('error');
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseBaixa = () => {
        close();
        if (urlLaudo && urlLaudo !== "")
            handleRemoveTemp();
        setUrlLaudo("");
        setContent("");
    };

    // LAUDO TÉCNICO
    const [laudoIsOpen, setLaudoIsOpen] = useState(false);
    const handleCloseLaudo = () => {
        setLaudoIsOpen(false);
    };

    const [content, setContent] = useState("");
    const [urlLaudo, setUrlLaudo] = useState<string>("");

    const handleRemoveTemp = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_PYTHON_API_URL}/remove-temp-file`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    temp_filename: urlLaudo,
                }),
            });

            if (response.ok) {
                return true;
            } else {
                return false;
            }
        } catch (err) {
            console.error(err);
            return false;
        }
    };
    
    const handleSave = async (texto: string) => {
        let verify = true;
        if (urlLaudo && urlLaudo !== "") {
            verify = await handleRemoveTemp();
        }

        if (verify) {
            const formattedItens = [
                ...itens.map(item => ({
                    descricao: item.tipo_fk.nome + " " + item.descricao,
                    patrimonio: item.num_patrimonio + " " + item.orgao_patrimonio
                })),
                ...semPatrimonio,
            ];

            setContent(texto);

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_PYTHON_API_URL}/laudo-tecnico`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        itens: formattedItens,
                        texto,
                    }),
                });

                if (response.ok) {
                    // const blob = await response.blob();
                    const url = await response.json();

                    // const url = window.URL.createObjectURL(blob);

                    // console.log(url);
                    
                    setUrlLaudo(url);
                    handleCloseLaudo();
                } else {
                    console.error('Erro ao gerar PDF: ', response.status);
                }
            } catch (err) {
                console.error(err);
            } finally {
                //
            }
        } else {
            console.log("Erro ao remover arquivo temporário.");
        }
    };

    const handleOpenLaudo = () => {
        const a = document.createElement('a');
        a.href = `${process.env.NEXT_PUBLIC_PYTHON_API_URL}/static/temp/${urlLaudo}`;
        a.target = '_blank';

        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);
        window.URL.revokeObjectURL(urlLaudo);
    };

    if (!isOpen || itens.length == 0) return null;

    return (
        <>
        <div className="absolute top-0 left-0">
            <div className="fixed top-0 left-0 z-20">
                <div className="fixed top-0 left-0 bg-black opacity-40 w-full h-full" onClick={handleCloseBaixa}></div>
                <Alert type={alertType} onClose={handleClose} className="left-20">{message}</Alert>
                <div className="fixed bg-white dark:bg-gray-800 px-6 pt-4 pb-6 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg max-h-[640px] min-w-96 shadow-lg">
                {
                    !laudoIsOpen ?
                    <div className="flex flex-col justify-center relative">
                        <span className="uppercase font-bold text-center text-lg">Baixa Patrimonial</span>
                        <div className="flex flex-col my-2">
                            <span className="text-sm font-medium">Itens patrimoniados:</span>
                            {
                                itens.map((item, index) => (
                                    <span key={index} className="text-sm">{item.tipo_fk.nome} {item.descricao} | {item.num_patrimonio} {item.orgao_patrimonio}<br></br></span>
                                ))
                            }
                            <span className="text-sm font-medium flex items-center gap-2">Itens sem patrimônio:<button onClick={() => setAddItem(true)} className="cursor-pointer text-blue-600"><FaPlusCircle /></button></span>
                            {
                                addItem &&
                                <div className="flex gap-2 items-center">
                                    <input type="text" name="descricao" id="descricao" value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Descrição do Item" className="w-full border-b outline-none p-1 text-sm focus:border-teal-500 transition ease-in-out duration-100" />
                                    <button onClick={handleAddItem} className="cursor-pointer text-blue-600"><FaCheckCircle /></button>
                                    <button onClick={() => setAddItem(false)} className="cursor-pointer text-blue-600"><FaCircleXmark /></button>
                                </div>
                            }
                            {
                                semPatrimonio.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <span className="text-sm">{item.descricao}</span>
                                        <button onClick={() => handleRemoveItem(index)} className="cursor-pointer text-blue-600"><FaCircleXmark /></button>
                                    </div>
                                ))
                            }
                            {
                                !urlLaudo || urlLaudo == "" ?
                                <a role="button" onClick={() => setLaudoIsOpen(true)} className="cursor-pointer mt-1 text-sm font-medium text-blue-600 hover:underline">Criar Laudo Técnico</a>
                                :
                                <div className="flex justify-between">
                                    <a role="button" onClick={handleOpenLaudo} className="cursor-pointer mt-1 text-sm font-medium text-blue-600 hover:underline">Abrir Laudo Técnico</a>
                                    <a role="button" onClick={() => setLaudoIsOpen(true)} className="cursor-pointer mt-1 text-sm font-medium text-blue-600 hover:underline">Editar Laudo Técnico</a>
                                </div>
                            }
                        </div>
                        <input type="text" name="memorando" id="memorando" value={memorando} onChange={(e) => setMemorando(e.target.value)} className="border-b outline-none p-1.5 focus:border-teal-500 transition ease-in-out duration-100" placeholder="Memorando/Proc. Administrativo" />
                        <input type="text" name="observacoes" id="observacoes" value={observacoes} onChange={(e) => setObservacoes(e.target.value)} className="border-b outline-none p-1.5 focus:border-teal-500 transition ease-in-out duration-100" placeholder="Observações" />
                        <button onClick={handleRegistrar} className="cursor-pointer border border-gray-800 mt-3 py-1.5 rounded bg-gray-800 text-white uppercase text-sm font-medium hover:bg-gray-900 hover:border-gray-900 transition ease-in-out duration-300 dark:bg-white dark:border-white dark:text-gray-800 dark:hover:bg-gray-200 dark:hover:border-gray-200">Registrar Baixa</button>
                    </div>
                    :
                    <FormLaudo isOpen={laudoIsOpen} onClose={handleCloseLaudo} onSave={handleSave} content={content} />
                }
                </div>
            </div>
        </div>
        </>
    );
}