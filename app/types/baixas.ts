import { Patrimonio } from "./patrimonio";

export interface Baixa {
    id: string;
    laudo?: string;
    memorando?: string;
    observacoes?: string;
    created_at: Date;
    updatet_at?: Date;
    itens: Item[];
}

interface Item {
    baixaId: string;
    patrimonioId: string;
    patrimonio_fk: Patrimonio;
}