export interface Funcionario {
    id: string;
    nome: string;
    rg: string;
    matricula: string;
    cargo: string | null;
    local: number;
    local_fisico: string;
    observacoes: string;
    local_fk: Local;
}

export interface Local {
    nome: string;
    apelido: string;
}