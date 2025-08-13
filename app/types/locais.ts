export interface Local {
    id: number;
    nome: string;
    apelido?: string | null;
    endereco: string;
    telefone_1?: string | null;
    telefone_2?: string | null;
    email_1?: string | null;
    email_2?: string | null;
    faixa_ip?: string | null;
    ativo: boolean;
}