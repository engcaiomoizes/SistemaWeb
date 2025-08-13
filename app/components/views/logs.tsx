import { buildStringDate } from "@/lib/string";
import { Log } from "@/types/logs";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import SearchSelect from "../searchSelect";
import { getMonth, getWeekly, isInLastFifteenDays, isInLastMonthly, isWeekly, lastFifteenDays, lastMonthly } from "@/lib/date";

interface Option {
    value: string;
    label: string;
}

export default function Logs() {
    const { data: session, status } = useSession();

    const [loading, setLoading] = useState<boolean>(false);

    const [logs, setLogs] = useState<Log[]>([]);

    const handleLoad = async () => {
        try {
            setLoading(true);

            const response = await fetch('/api/logs');

            if (response.ok) {
                const data = await response.json();
                console.log(data);
                setLogs(data.response);
            } else {
                //
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleLoad();
    }, []);

    const semana = getWeekly();

    const options: Option[] = [
        {
            value: "weekly",
            label: "Esta semana",
        },
        {
            value: "month",
            label: "Este mês",
        },
        {
            value: "biweekly",
            label: "Últimos 15 dias",
        },
        {
            value: "monthly",
            label: "Últimos 30 dias",
        },
    ];

    const [selectedOption, setSelectedOption] = useState<Option>({ value: "weekly", label: "Esta semana" });

    return (
        <div className="flex flex-col items-center border rounded pt-2 pb-4 px-6">
            <span className="font-bold text-lg">Registro de Logs</span>
            <div className="flex flex-col gap-2 mt-4">
                <SearchSelect msStyle="w-64" options={options} selectedOption={selectedOption} onChange={(selected: any) => setSelectedOption(selected)} placeholder="Selecione um período..." />
                <div className="overflow-y-scroll max-h-[500px]">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">Descrição</th>
                                <th scope="col" className="px-6 py-3">Usuário</th>
                                <th scope="col" className="px-6 py-3">Data</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                logs.map((log, index) => (
                                    isWeekly(log.created_at) && selectedOption.value == "weekly" ?
                                    <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                                        <td scope="row" className="px-6 py-3">{log.descricao}</td>
                                        <td className="px-6 py-3">{log.usuario_fk.nome}</td>
                                        <td className="px-6 py-3">{buildStringDate(log.created_at)}</td>
                                    </tr>
                                    :
                                    new Date(log.created_at).getMonth() == getMonth() && selectedOption.value == "month" ?
                                    <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                                        <td scope="row" className="px-6 py-3">{log.descricao}</td>
                                        <td className="px-6 py-3">{log.usuario_fk.nome}</td>
                                        <td className="px-6 py-3">{buildStringDate(log.created_at)}</td>
                                    </tr>
                                    :
                                    isInLastFifteenDays(log.created_at) && selectedOption.value == "biweekly" ?
                                    <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                                        <td scope="row" className="px-6 py-3">{log.descricao}</td>
                                        <td className="px-6 py-3">{log.usuario_fk.nome}</td>
                                        <td className="px-6 py-3">{buildStringDate(log.created_at)}</td>
                                    </tr>
                                    :
                                    isInLastMonthly(log.created_at) && selectedOption.value == "monthly" ?
                                    <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                                        <td scope="row" className="px-6 py-3">{log.descricao}</td>
                                        <td className="px-6 py-3">{log.usuario_fk.nome}</td>
                                        <td className="px-6 py-3">{buildStringDate(log.created_at)}</td>
                                    </tr>
                                    :
                                    ''
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}