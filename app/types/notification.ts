export interface Notification {
    id: number;
    updateId: number | null;
    title: string;
    description: string;
    created_at: Date;
    updated_at: Date | null;
    update?: Update;
}

export interface Update {
    id: number;
    numero: string;
    resumo: string;
    notas: string | null;
    created_at: Date;
    updated_at: Date | null;
}