import { useEffect, useState } from "react";

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
}

export default function Transferencia(props: any) {
    const [locais, setLocais] = useState<Local[]>([]);
    const [localPara, setLocalPara] = useState<number>();
    const [observacoes, setObservacoes] = useState<string>("");

    useEffect(() => {
        const fetchLocais = async () => {
            try {
                const response = await fetch('/api/locais');
                if (!response.ok) {
                    throw new Error(`Erro ao buscar locais: ${response.status} - ${response.statusText}`);
                }
                const data = await response.json();
                setLocais(data.response);
                setLocalPara(data.response[0].id);
            } catch (err: any) {
                console.log(err.message);
            } finally {
                //
            }
        };

        if (props.item)
            fetchLocais();
    }, []);

    const handleTransferir = async () => {
        try {
            const response = await fetch('/api/transferencias', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: props.item.id,
                    localDe: props.item.localId,
                    localPara: localPara,
                    observacoes: observacoes,
                }),
            });

            if (response.ok) {
                props.close();
                props.reload();
            } else {
                //
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="absolute top-0 left-0">
            <div className={`${props.show ? '' : 'hidden'} fixed top-0 left-0 z-20`}>
                <div className="fixed top-0 left-0 bg-black opacity-40 w-full h-full" onClick={props.close}></div>
                <div className="fixed bg-white dark:bg-gray-800 px-6 pt-4 pb-6 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg max-h-[640px] min-w-96 shadow-lg">
                    <div className="flex items-center relative">
                        <span className="font-bold uppercase">Transferir patrimônio</span>
                        <button className="absolute right-0 cursor-pointer" onClick={props.close}>
                            <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6"/>
                            </svg>
                        </button>
                    </div>
                    <span className="flex text-sm mb-2"><b>Item:</b>&nbsp;{props.item.titulo}</span>
                    <div className="flex flex-col">
                        <div className="flex flex-col group relative w-full mb-2">
                            <label htmlFor="localDe" className={`text-gray-600 cursor-text dark:text-gray-400`}>Local atual</label>
                            <span>{props.item.nome}</span>
                        </div>
                        <div className="flex flex-col group relative w-full mb-2">
                            <label htmlFor="localPara" className={`text-gray-600 cursor-text dark:text-gray-400`}>Local a ser transferido</label>
                            <select name="local" id="local" value={localPara} onChange={(e) => setLocalPara(Number(e.target.value))} className="flex bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                {
                                    locais.map((item) => (
                                        <option key={item.id} value={item.id}>{item.nome}</option>
                                    ))
                                }
                            </select>
                        </div>
                        <div className="flex flex-col group relative w-full mb-2">
                            <label htmlFor="observacoes" className={`text-gray-600 cursor-text dark:text-gray-400 group-focus-within:text-teal-500`}>Observações</label>
                            <input type="text" name="observacoes" id="observacoes" value={observacoes} onChange={(e) => setObservacoes(e.target.value)} className="border-b outline-none dark:bg-gray-800 focus:border-teal-500 w-full" />
                        </div>
                        <button onClick={handleTransferir} className="cursor-pointer border rounded border-gray-800 bg-gray-800 text-white dark:border-white dark:bg-white dark:text-gray-800 uppercase font-medium text-sm py-2 mt-3 flex justify-center items-center hover:bg-white hover:text-gray-800 hover:dark:bg-gray-800 hover:dark:text-white transition ease-in-out duration-150">Transferir</button>
                    </div>
                </div>
            </div>
        </div>
    );
}