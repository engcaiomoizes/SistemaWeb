import { Funcionario } from "@/types/funcionario";

interface Props {
    item: Funcionario | undefined;
    isOpen: boolean;
    close: () => void;
}

export default function FuncionarioView(props: Props) {
    if (!props.item) return;

    return (
        <div className={`${props.isOpen ? '' : 'hidden'} fixed top-0 left-0 z-50`}>
            <div className="fixed bg-black opacity-40 w-full h-full" onClick={props.close}></div>
            <div className="fixed bg-gray-800 shadow-lg p-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg max-h-[640px] min-w-96 w-[520px]">
                <button className="cursor-pointer absolute top-2 right-2" onClick={props.close}>
                    <svg className="w-6 h-6 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 17.94 6M18 18 6.06 6"/>
                    </svg>
                </button>
                <div className="flex flex-col items-center justify-center text-white">
                    <span className="font-bold text-center">{props.item.nome}</span>
                    <span className="text-sm mb-2">{props.item.cargo}</span>
                    <span className="text-sm"><b>Matrícula:</b> {props.item.matricula}</span>
                    <span className="text-sm"><b>RG:</b> {props.item.rg}</span>
                    <span className={`${props.item.local ? '' : 'hidden'} text-sm`}><b>Sede:</b> {props.item.local_fk?.nome}</span>
                </div>
            </div>
        </div>
    );
}