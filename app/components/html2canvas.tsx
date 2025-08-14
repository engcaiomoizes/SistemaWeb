'use client';

import { useEffect, useState } from "react";
import { Funcionario } from "@/types/funcionario";
import MultiSelect from "./multiSelect";

interface Props {
    funcionarios: Funcionario[];
    ano: number;
    mes: number;
    title: string;
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

interface Option {
    value: number;
    label: string;
}

export default function HTML2Canvas(props: Props) {
    const [holidays, setHolidays] = useState<Feriado[]>([]);

    const [gerando, setGerando] = useState(false);

    const handleFeriados = async () => {
        try {
            const response = await fetch(`/api/feriados`);

            const data = await response.json();

            setHolidays(data.response);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        handleFeriados();
        getWeekendDays();
    }, [props.funcionarios, props.ano, props.mes]);

    const generatePDF = async () => {
        try {
            setGerando(true);

            const ids = props.funcionarios.map(funcionario => funcionario.id);
            const dias_abertos = selectedOptions.map(opt => opt.value);

            const response = await fetch(`${process.env.NEXT_PUBLIC_PYTHON_API_URL}/folhas-ponto`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ano: props.ano,
                    mes: props.mes,
                    funcionarios: ids,
                    dias_abertos: dias_abertos,
                }),
            });

            if (response.ok) {
                const blob = await response.blob();

                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.target = '_blank';

                document.body.appendChild(a);
                a.click();

                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            } else {
                console.error('Erro ao gerar PDF: ', response.status);
            }
        } catch (err) {
            console.error('Erro ao gerar PDF: ', err);
        } finally {
            setGerando(false);
        }
    };

    const [weekendDays, setWeekendDays] = useState<Day[]>([]);

    const getWeekendDays = () => {
        const daysInMonth = new Date(props.ano, props.mes, 0).getDate(); // Obtém o número de dias no mês

        const weekendDaysArray: any = [];

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(props.ano, props.mes - 1, day);
            const dayOfWeek = date.getDay(); // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado

            const formattedDate = `${day.toString().padStart(2, '0')}/${props.mes.toString().padStart(2, '0')}/${props.ano}`;
            const isHoliday = holidays.some((holiday) => holiday.data === formattedDate);

            weekendDaysArray.push({ day, weekend: dayOfWeek, holiday: isHoliday });
        }

        setWeekendDays(weekendDaysArray);

        console.log(weekendDaysArray);
    };

    // Configurações
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState<Option[]>([]);
    const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);

    useEffect(() => {
        const filtrados = weekendDays.filter(wd => (wd.weekend === 0 || wd.weekend == 6));

        const transformedOptions: Option[] = filtrados.map(wd => ({
            value: wd.day,
            label: `${wd.day.toString().padStart(2, '0')}/${props.mes.toString().padStart(2, '0')}/${props.ano} - ${wd.weekend === 0 ? 'Domingo' : 'Sábado'}`,
        }));

        setOptions(transformedOptions);
    }, [weekendDays]);

    const handleChange = (selected: any) => {
        setSelectedOptions(selected);
    };

    return (
        <>
        {/* <div className="flex justify-center p-10">
            <div className="container">*/}
            <div className="flex items-center justify-center gap-2">
                <button onClick={generatePDF} disabled={gerando} className="cursor-pointer border rounded py-1 px-4 bg-teal-500 border-teal-500 text-white font-medium uppercase hover:bg-teal-600 hover:border-teal-600 transition ease-in-out duration-150">
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
                <button onClick={() => setOpen(!open)} className="cursor-pointer border rounded p-1 bg-teal-500 border-teal-500 text-white font-medium uppercase hover:bg-teal-600 hover:border-teal-600 transition ease-in-out duration-150">
                    <svg className="w-6 h-6 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13v-2a1 1 0 0 0-1-1h-.757l-.707-1.707.535-.536a1 1 0 0 0 0-1.414l-1.414-1.414a1 1 0 0 0-1.414 0l-.536.535L14 4.757V4a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v.757l-1.707.707-.536-.535a1 1 0 0 0-1.414 0L4.929 6.343a1 1 0 0 0 0 1.414l.536.536L4.757 10H4a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h.757l.707 1.707-.535.536a1 1 0 0 0 0 1.414l1.414 1.414a1 1 0 0 0 1.414 0l.536-.535 1.707.707V20a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-.757l1.707-.708.536.536a1 1 0 0 0 1.414 0l1.414-1.414a1 1 0 0 0 0-1.414l-.535-.536.707-1.707H20a1 1 0 0 0 1-1Z"/>
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
                    </svg>
                </button>
                <div className={`${open ? '' : 'hidden'} flex w-96 max-w-96`}>
                    <MultiSelect msStyle={'w-full'} placeholder="Abrir sábados e domingos..." options={options} selectedOptions={selectedOptions} onChange={handleChange} />
                </div>
            </div>
            {/* </div>
        </div> */}
        </>
    );
}