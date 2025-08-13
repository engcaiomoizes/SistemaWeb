import { Patrimonio } from "@/types/patrimonio";
import { useState } from "react";
import Alert from "../alert";

interface Props {
    itens: Patrimonio[];
    isOpen: boolean;
    close: () => void;
    reload: () => void;
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
    // const [patrimoniosId, setPatrimoniosId] = useState<string[]>([]);

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

    return (
        <>
        {
            (isOpen && itens.length > 0) &&
            <div className="absolute top-0 left-0">
            <div className="fixed top-0 left-0 z-20">
                <div className="fixed top-0 left-0 bg-black opacity-40 w-full h-full" onClick={close}></div>
                <Alert type={alertType} onClose={handleClose} className="left-20">{message}</Alert>
                <div className="fixed bg-white dark:bg-gray-800 px-6 pt-4 pb-6 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg max-h-[640px] min-w-96 shadow-lg">
                    <div className="flex flex-col justify-center relative">
                        <span className="uppercase font-bold text-center text-lg">Baixa Patrimonial</span>
                        <div className="flex flex-col my-2">
                            <span className="text-sm font-medium">Itens:</span>
                            {
                                itens.map((item, index) => (
                                    <span key={index} className="text-sm">{item.tipo_fk.nome} {item.descricao} | {item.num_patrimonio} {item.orgao_patrimonio}<br></br></span>
                                ))
                            }
                        </div>
                        <input type="text" name="memorando" id="memorando" value={memorando} onChange={(e) => setMemorando(e.target.value)} className="border-b outline-none p-1.5 focus:border-teal-500 transition ease-in-out duration-100" placeholder="Memorando/Proc. Administrativo" />
                        <input type="text" name="observacoes" id="observacoes" value={observacoes} onChange={(e) => setObservacoes(e.target.value)} className="border-b outline-none p-1.5 focus:border-teal-500 transition ease-in-out duration-100" placeholder="Observações" />
                        <button onClick={handleRegistrar} className="cursor-pointer border border-gray-800 mt-3 py-1.5 rounded bg-gray-800 text-white uppercase text-sm font-medium hover:bg-gray-900 hover:border-gray-900 transition ease-in-out duration-300">Registrar Baixa</button>
                    </div>
                </div>
            </div>
        </div>
        }
        </>
    );
}