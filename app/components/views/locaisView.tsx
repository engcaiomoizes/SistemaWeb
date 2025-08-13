import { Local } from "@/types/locais";

interface Props {
    item?: Local;
    view: boolean;
    fechar: () => void;
}

export default function LocaisView(props: Props) {
    return (
        <>
        <div className={`${props.view ? '' : 'hidden'} fixed top-0 left-0 z-50`}>
            <div className="fixed bg-black opacity-40 w-full h-full" onClick={props.fechar}></div>
            <div className="fixed bg-gray-800 shadow-lg p-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg max-h-[640px] min-w-96 w-[520px]">
                <button className="cursor-pointer absolute top-2 right-2" onClick={props.fechar}>
                    <svg className="w-6 h-6 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 17.94 6M18 18 6.06 6"/>
                    </svg>
                </button>
                <div className="flex flex-col justify-center items-center text-white">
                    <span className="font-bold mb-2 text-center">{props.item?.nome}{props.item?.apelido ? ` | ${props.item.apelido}` : ''}</span>
                    <span className="text-sm"><b>Endereço:</b> {props.item?.endereco}</span>
                    {
                        props.item?.telefone_1 &&
                        <span className="text-sm"><b>Telefone:</b> {props.item.telefone_1}</span>
                    } {
                        props.item?.telefone_2 &&
                        <span className="text-sm"><b>Telefone 2: </b> {props.item.telefone_2}</span>
                    } {
                        props.item?.email_1 &&
                        <span className="text-sm"><b>E-mail:</b> {props.item.email_1}</span>
                    } {
                        props.item?.email_2 &&
                        <span className="text-sm"><b>E-mail 2:</b> {props.item.email_2}</span>
                    } {
                        props.item?.faixa_ip &&
                        <span className="text-sm"><b>Faixa IP:</b> {props.item.faixa_ip}</span>
                    }
                </div>
            </div>
        </div>
        </>
    );
}