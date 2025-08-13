import { Patrimonio } from "@/types/patrimonio";
import { useEffect, useState } from "react";
import SearchSelect from "../searchSelect";
import Link from "next/link";

interface Option {
    value: string;
    label: string;
}

export default function LastPatrimonios() {
    const [loading, setLoading] = useState(false);

    const [patrimonios, setPatrimonios] = useState<Patrimonio[]>([]);

    const options: Option[] = [
        {
            value: "5",
            label: "Últimos 5 cadastrados",
        },
        {
            value: "10",
            label: "Últimos 10 cadastrados",
        },
        {
            value: "20",
            label: "Últimos 20 cadastrados",
        },
        {
            value: "50",
            label: "Últimos 50 cadastrados",
        },
    ];

    const [selectedOption, setSelectedOption] = useState<Option>({ value: "5", label: "Últimos 5 cadastrados" });

    const handleLoad = async () => {
        try {
            setLoading(true);

            const response = await fetch(`/api/patrimonios?order=desc&by=created_at&limit=${selectedOption.value}`);

            if (response.ok) {
                const data = await response.json();
                setPatrimonios(data.response);
            } else {
                //
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleLoad();
    }, [selectedOption]);

    return (
        <div className="flex flex-col items-center border rounded pt-2 pb-4 px-6">
            <span className="font-bold text-lg">Últimos Patrimônios cadastrados</span>
            <div className="flex flex-col gap-2 mt-4">
                <SearchSelect msStyle="w-64" options={options} selectedOption={selectedOption} onChange={(selected: any) => setSelectedOption(selected)} placeholder="Selecione um período..." />
                <div className="overflow-y-scroll max-h-[500px]">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">Nº Patrimônio</th>
                                <th scope="col" className="px-6 py-3">Descrição</th>
                                <th scope="col" className="px-6 py-3">Ação</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                patrimonios.map((item, index) => (
                                    selectedOption.value == "5" ?
                                    <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                                        <td scope="row" className="px-6 py-3">{item.num_patrimonio} {item.orgao_patrimonio}</td>
                                        <td className="px-6 py-3">{item.tipo_fk.nome} {item.descricao}</td>
                                        <td className="px-6 py-3 text-right flex">
                                            <Link href={ `/patrimonios/editar/${item.id}` } className="font-medium text-blue-600 dark:text-blue-500 hover:underline me-2">
                                                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"/>
                                                </svg>
                                            </Link>
                                        </td>
                                    </tr>
                                    :
                                    selectedOption.value == "10" ?
                                    <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                                        <td scope="row" className="px-6 py-3">{item.num_patrimonio} {item.orgao_patrimonio}</td>
                                        <td className="px-6 py-3">{item.tipo_fk.nome} {item.descricao}</td>
                                        <td className="px-6 py-3 text-right flex">
                                            <Link href={ `/patrimonios/editar/${item.id}` } className="font-medium text-blue-600 dark:text-blue-500 hover:underline me-2">
                                                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"/>
                                                </svg>
                                            </Link>
                                        </td>
                                    </tr>
                                    :
                                    selectedOption.value == "20" ?
                                    <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                                        <td scope="row" className="px-6 py-3">{item.num_patrimonio} {item.orgao_patrimonio}</td>
                                        <td className="px-6 py-3">{item.tipo_fk.nome} {item.descricao}</td>
                                        <td className="px-6 py-3 text-right flex">
                                            <Link href={ `/patrimonios/editar/${item.id}` } className="font-medium text-blue-600 dark:text-blue-500 hover:underline me-2">
                                                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"/>
                                                </svg>
                                            </Link>
                                        </td>
                                    </tr>
                                    :
                                    selectedOption.value == "50" ?
                                    <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                                        <td scope="row" className="px-6 py-3">{item.num_patrimonio} {item.orgao_patrimonio}</td>
                                        <td className="px-6 py-3">{item.tipo_fk.nome} {item.descricao}</td>
                                        <td className="px-6 py-3 text-right flex">
                                            <Link href={ `/patrimonios/editar/${item.id}` } className="font-medium text-blue-600 dark:text-blue-500 hover:underline me-2">
                                                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"/>
                                                </svg>
                                            </Link>
                                        </td>
                                    </tr>
                                    :
                                    ''
                                ))
                            }
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-center">
                    <Link href={ `/patrimonios` } className="underline text-blue-600">Ir para <b>Patrimônios</b></Link>
                </div>
            </div>
        </div>
    );
}