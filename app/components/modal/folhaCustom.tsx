import { useCallback, useEffect, useRef, useState } from "react";
import MultiSelect from "../multiSelect";
import { Funcionario } from "@/types/funcionario";
import { getNomeMes } from "@/lib/string";

interface Option {
    value: number;
    label: string;
}

interface Day {
    day: number;
    weekend: number;
    holiday: boolean;
}

interface Feriado {
    data: string;
    descricao: string;
}

interface Props {
    isOpen: boolean;
    close: () => void;
    mes: number;
    ano: number;
    funcionarios: Funcionario[];
}

export default function FolhaCustom(props: Props) {
    const [options, setOptions] = useState<Option[]>([]);
    const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);

    const funcionarios = props.funcionarios;

    const pdfRef = useRef<HTMLDivElement>(null);

    const [weekendDays, setWeekendDays] = useState<Day[]>([]);
    const [daysInMonth, setDaysInMonth] = useState(0);
    const [holidays, setHolidays] = useState<Feriado[]>([]);

    const [loading, setLoading] = useState(false);
    const [gerando, setGerando] = useState(false);
    const [message, setMessage] = useState("");

    const getWeekendDays = () => {
        const daysInMonth = new Date(props.ano, props.mes, 0).getDate(); // Obtém o número de dias no mês

        setDaysInMonth(daysInMonth);

        const weekendDaysArray: any = [];

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(props.ano, props.mes - 1, day);
            const dayOfWeek = date.getDay(); // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado

            const formattedDate = `${day.toString().padStart(2, '0')}/${props.mes.toString().padStart(2, '0')}/${props.ano}`;
            const isHoliday = holidays.some((holiday) => holiday.data === formattedDate);

            weekendDaysArray.push({ day, weekend: dayOfWeek, holiday: isHoliday });
        }

        setWeekendDays(weekendDaysArray);
    };

    const handleFeriados = async () => {
        try {
            const response = await fetch(`/api/feriados`);

            const data = await response.json();

            setHolidays(data.response);
        } catch (err) {
            console.log(err);
        }
    };

    const handleChange = (selected: any) => {
        setSelectedOptions(selected);
        setMessage("");
    };

    const handleLoad = async () => {
        try {
            const response = await fetch('/api/locais');

            const data = await response.json();

            if (response.ok) {
                const tempOptions: Option[] = data.response.map((item: any) => ({
                    value: item.id,
                    label: item.apelido ? item.apelido : item.nome,
                }));

                setOptions(tempOptions);
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (props.isOpen) {
            handleLoad();
            handleFeriados();
        }
    }, [props.isOpen]);

    useEffect(() => {
        if (holidays.length > 0)
            getWeekendDays();
    }, [holidays]);

    // Lógica de filtragem (pesquisa)
    const dadosFiltrados = funcionarios.filter(item => {
        return selectedOptions.some(option => option.value === item.local);
    });

    const gerarFolhas = async () => {
        if (selectedOptions.length > 0) {
            setGerando(true);

            const htmlContent = pdfRef.current?.outerHTML;

            try {
                const response = await fetch('/api/generate-pdf', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ html: htmlContent }),
                });

                if (response.ok) {
                    const blob = await response.blob();

                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.target = '_blank';
                    //a.download = `${props.title}.pdf`;

                    document.body.appendChild(a);
                    a.click();

                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                } else {
                    console.error('Erro ao gerar PDF: ', response.status);
                }
            } catch (err) {
                console.error('Erro ao gerar PDF: ', err);
            }

            setGerando(false);
        } else {
            setMessage("Selecione pelo menos um Local.");
        }
    };

    // Configurações de Sábados e Domingos
    const [wOptions, setWOptions] = useState<Option[]>([]);
    const [selectedWOptions, setSelectedWOptions] = useState<Option[]>([]);

    const handleWChange = (selected: any) => {
        setSelectedWOptions(selected);
    };

    const isDaySelected = (day: number): boolean => {
        return selectedWOptions.some(option => option.value === day);
    };

    useEffect(() => {
        const filtrados = weekendDays.filter(wd => (wd.weekend === 0 || wd.weekend === 6));

        const transformedOptions: Option[] = filtrados.map(wd => ({
            value: wd.day,
            label: `${wd.day.toString().padStart(2, '0')}/${props.mes.toString().padStart(2, '0')}/${props.ano} - ${wd.weekend === 0 ? 'Domingo' : 'Sábado'}`,
        }));

        setWOptions(transformedOptions);
    }, [weekendDays]);

    return (
        <>
        <div className={`${props.isOpen ? '' : 'hidden'} fixed top-0 left-0 z-50`}>
            <div className="fixed bg-black opacity-40 w-full h-full" onClick={props.close}></div>
            <div className="fixed bg-white dark:bg-gray-800 shadow-lg p-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg max-h-[720px] min-w-96 w-[600px] h-[600px] overflow-y-auto">
                <button className="cursor-pointer absolute top-2 right-2" onClick={props.close}>
                    <svg className="w-6 h-6 text-foreground" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 17.94 6M18 18 6.06 6"/>
                    </svg>
                </button>
                {
                    loading ?
                    <div role="status" className="flex justify-center">
                        <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/></svg>
                        <span className="sr-only">Loading...</span>
                    </div>
                    :
                    <>
                    <div className="flex flex-col">
                        <div className="mb-2">
                            <span className="text-sm font-medium">Gerar por sede de serviço:</span>
                            <MultiSelect msStyle={'w-full'} placeholder="Selecione..." options={options} selectedOptions={selectedOptions} onChange={handleChange} />
                            <span className="text-red-600 text-sm font-medium">{message}</span>
                        </div>
                        <div className="mb-2">
                            <span className="text-sm font-medium">Abrir sábados e domingos:</span>
                            <MultiSelect msStyle={'w-full'} placeholder="Selecione..." options={wOptions} selectedOptions={selectedWOptions} onChange={handleWChange} />
                        </div>
                        <button onClick={gerarFolhas} disabled={gerando} className="cursor-pointer border rounded mt-2 p-1 uppercase font-medium text-white bg-teal-500 border-teal-500 hover:bg-teal-600 hover:border-teal-600 transition ease-in-out duration-100">
                            {
                                gerando ?
                                <div role="status" className="flex justify-center">
                                    <svg aria-hidden="true" className="w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/></svg>
                                    <span className="sr-only">Loading...</span>
                                </div>
                                :
                                'Gerar'
                            }
                        </button>
                    </div>
                    <div className="mt-6">
                        {
                            funcionarios &&
                            <div className={`relative bg-white text-black w-[793px]`} ref={pdfRef}>
                                {
                                    dadosFiltrados.length > 0 &&
                                    dadosFiltrados.map((item, index) => (
                                        <>
                                        <div className="w-full flex justify-center">
                                            <object data={`${process.env.NEXT_PUBLIC_SITE_URL}/static/img/header.svg`} type="image/svg+xml" className="w-[85%]"></object>
                                        </div>
                                        <div key={index} className="mb-4">
                                            <div>
                                                <div className="px-16 flex flex-col space-y-2 mb-4 font-times">
                                                    <span className="uppercase font-bold">Nome: {item.nome}</span>
                                                    <span className="uppercase font-bold">Matrícula: {item.matricula}</span>
                                                    <span className="uppercase font-bold">Cargo/Função: {item.cargo}</span>
                                                    <span className="uppercase font-bold">Sede de serviço: {item.local_fk?.apelido ? item.local_fk?.apelido : item.local_fk?.nome}</span>
                                                    <span className="uppercase font-bold">RG: {item.rg}</span>
                                                </div>
                                                <div className="flex flex-col px-10 font-times">
                                                    <span className="text-end font-bold px-6">Período: 01 a {daysInMonth} de {getNomeMes(props.mes)} de {props.ano}</span>
                                                    <table className="w-full">
                                                        <thead>
                                                            <tr>
                                                                <th colSpan={4} className="text-sm border border-black px-1">Primeiro Período</th>
                                                                <th colSpan={3} className="text-sm border border-black px-1">Segundo Período</th>
                                                            </tr>
                                                            <tr>
                                                                <th className="text-sm border border-black px-1 w-8">Dia</th>
                                                                <th className="text-sm border border-black px-1 w-24">Hora Entrada</th>
                                                                <th className="text-sm border border-black px-1 w-24">Saída Almoço</th>
                                                                <th className="text-sm border border-black">Assinatura</th>
                                                                <th className="text-sm border border-black px-1 w-24">Retorno Almoço</th>
                                                                <th className="text-sm border border-black px-1 w-24">Hora Saída</th>
                                                                <th className="text-sm border border-black">Assinatura</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                weekendDays.length > 0 &&
                                                                weekendDays.map((item, index) => (
                                                                    <tr key={index}>
                                                                        <td className="text-sm border border-black text-center font-bold">{item.day.toString().padStart(2, '0')}</td>
                                                                        <td className="text-sm border border-black text-center font-bold">
                                                                            {
                                                                                !isDaySelected(item.day) && item.weekend === 0 ?
                                                                                'Domingo'
                                                                                :
                                                                                !isDaySelected(item.day) && item.weekend === 6 ?
                                                                                'Sábado'
                                                                                :
                                                                                item.holiday ?
                                                                                'FERIADO'
                                                                                :
                                                                                ''
                                                                            }
                                                                        </td>
                                                                        <td className="text-sm overflow-hidden text-clip border border-black text-center max-w-8">
                                                                            {
                                                                                !isDaySelected(item.day) && (item.weekend === 0 || item.weekend === 6 || item.holiday) ?
                                                                                '############'
                                                                                :
                                                                                ''
                                                                            }
                                                                        </td>
                                                                        <td className="text-sm overflow-hidden text-clip border border-black text-center max-w-16">
                                                                            {
                                                                                !isDaySelected(item.day) && (item.weekend === 0 || item.weekend === 6 || item.holiday) ?
                                                                                '###################'
                                                                                :
                                                                                ''
                                                                            }
                                                                        </td>
                                                                        <td className="text-sm overflow-hidden text-clip border border-black text-center max-w-8">
                                                                            {
                                                                                !isDaySelected(item.day) && (item.weekend === 0 || item.weekend === 6 || item.holiday) ?
                                                                                '############'
                                                                                :
                                                                                ''
                                                                            }
                                                                        </td>
                                                                        <td className="text-sm overflow-hidden text-clip border border-black text-center max-w-8">
                                                                            {
                                                                                !isDaySelected(item.day) && (item.weekend === 0 || item.weekend === 6 || item.holiday) ?
                                                                                '############'
                                                                                :
                                                                                ''
                                                                            }
                                                                        </td>
                                                                        <td className="text-sm overflow-hidden text-clip border border-black text-center max-w-16">
                                                                            {
                                                                                !isDaySelected(item.day) && (item.weekend === 0 || item.weekend === 6 || item.holiday) ?
                                                                                '###################'
                                                                                :
                                                                                ''
                                                                            }
                                                                        </td>
                                                                    </tr>
                                                                ))
                                                            }
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`w-full flex justify-center mt-auto`}>
                                            <object data={`${process.env.NEXT_PUBLIC_SITE_URL}/static/img/footer.svg`} type="image/svg+xml" className=""></object>
                                        </div>
                                        {
                                            (index < funcionarios.length - 1) &&
                                            <div className="page-break"></div>
                                        }
                                        </>
                                    ))
                                }
                            </div>
                        }
                    </div>
                    </>
                }
            </div>
        </div>
        </>
    );
}