export interface Log {
    id: number;
    usuario: string;
    descricao: string;
    detalhes?: string;
    created_at: Date;
    usuario_fk: Usuario;
}

interface Usuario {
    id: string;
    nome: string;
}