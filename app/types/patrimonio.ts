export interface Patrimonio {
    id: string;
    tipo: number;
    descricao: string;
    num_patrimonio: number;
    orgao_patrimonio: string;
    local: number;
    tipo_fk: Tipo;
}

interface Tipo {
    nome: string;
}