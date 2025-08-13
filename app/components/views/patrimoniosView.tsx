export default function PatrimoniosView(props: any) {
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
                    <span className="font-bold mb-2 text-center">{props.item?.tipo_fk.nome} | {props.item?.descricao}</span>
                    <span className="text-sm"><b>Patrimônio:</b> { props.item?.num_patrimonio?.toString().padStart(7, '0') } {props.item?.orgao_patrimonio}</span>
                    <span className={`text-sm ${props.item?.medidas ? '' : 'hidden'}`}><b>Medidas (AxLxP):</b> {props.item?.medidas}</span>
                    <span className={`text-sm`}><b>Local:</b> {props.item?.local_fk.nome} {props.item?.local_fk.apelido ? '(' + props.item?.local_fk.apelido + ')' : ''}</span>
                    <span className={`text-sm ${props.item?.local_fisico ? '' : 'hidden'}`}><b>Local Físico:</b> {props.item?.local_fisico}</span>
                    <span className={`text-sm ${props.item?.observacoes ? '' : 'hidden'}`}><b>Observações:</b> {props.item?.observacoes}</span>
                    {/* {
                        props.item?.baixas[0] &&
                        <>
                        <span className="font-bold uppercase mt-2 text-red-600">Partimônio baixado</span>
                        <span className="text-sm"><b>Justificativa:</b> {props.item?.baixas[0].justificativa!}</span>
                        </>
                    } */}
                </div>
            </div>
        </div>
        </>
    );
}