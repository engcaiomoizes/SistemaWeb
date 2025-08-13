import { useEffect, useState } from "react";

interface Nivel {
    id: string;
    nome: string;
}

export default function ChangeNivel(props: any) {
    const [niveis, setNiveis] = useState<Nivel[]>([]);
    const [nivel, setNivel] = useState<string>();

    useEffect(() => {
        const fetchNiveis = async () => {
            try {
                const response = await fetch('/api/niveis');
                if (!response.ok) {
                    throw new Error(`Erro ao buscar níveis: ${response.status} - ${response.statusText}`);
                }
                const data = await response.json();
                console.log(data);
                setNiveis(data.response);

                setNivel(props.item.nivel ?? data.response[0].id);
            } catch (err: any) {
                console.log(err.message);
            } finally {
                //
            }
        };

        if (props.item)
            fetchNiveis();
    }, [props.item]);

    const handleDefinir = async () => {
        try {
            const response = await fetch(`/api/usuarios/${props.item?.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nivel: nivel }),
            });

            if (response.ok) {
                props.close();
                props.reload();
            } else {
                //
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
        <div className="absolute top-0 left-0">
            <div className={`${props.show ? '' : 'hidden'} fixed top-0 left-0 z-20`}>
                <div className="fixed top-0 left-0 bg-black opacity-40 w-full h-full" onClick={props.close}></div>
                <div className="fixed bg-white dark:bg-gray-800 px-6 pt-4 pb-6 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg max-h-[640px] min-w-96 shadow-lg">
                    <div className="flex items-center relative">
                        <span className="font-bold uppercase">Definir Nível</span>
                        <button className="absolute right-0 cursor-pointer" onClick={props.close}>
                            <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6"/>
                            </svg>
                        </button>
                    </div>
                    <span className="flex text-sm"><b>Usuário:</b>&nbsp;{props.item?.nome}</span>
                    {
                        props.item?.nivel &&
                        <span className="flex text-sm"><b>Nível atual:</b>&nbsp;{props.item.nivel_fk.nome}</span>
                    }
                    <div className="flex flex-col mt-2">
                        <div className="flex flex-col group relative w-full mb-2">
                            <label htmlFor="nivel" className={`text-gray-600 dark:text-gray-400 text-sm ps-1`}>Nível</label>
                            <select name="nivel" id="nivel" value={nivel} onChange={(e) => setNivel(e.target.value)} className="flex bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                {
                                    niveis.map((item) => (
                                        <option key={item.id} value={item.id}>{item.nome}</option>
                                    ))
                                }
                            </select>
                        </div>
                        <button onClick={handleDefinir} className="cursor-pointer border rounded border-gray-800 bg-gray-800 text-white dark:border-white dark:bg-white dark:text-gray-800 uppercase font-medium text-sm py-2 mt-3 flex justify-center items-center hover:bg-white hover:text-gray-800 hover:dark:bg-gray-800 hover:dark:text-white transition ease-in-out duration-150">Definir</button>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}