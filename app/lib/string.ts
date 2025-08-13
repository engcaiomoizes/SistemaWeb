export function getCurrentDate() {
    const currentDate = `${new Date().getUTCFullYear()}-${new Date().getUTCMonth() + 1}-${new Date().getUTCDate()} ${new Date().getUTCHours() - 3}:${new Date().getUTCMinutes()}:${new Date().getUTCSeconds()}.${new Date().getUTCMilliseconds()}`;

    return currentDate;
}

export function getCurrentYear() {
    return new Date().getUTCFullYear();
}

export function getCurrentMonth() {
    return new Date().getUTCMonth() + 1;
}

export function getNomeMes(month: number) {
    switch (month) {
        case 1: return "JANEIRO";
        case 2: return "FEVEREIRO";
        case 3: return "MARÇO";
        case 4: return "ABRIL";
        case 5: return "MAIO";
        case 6: return "JUNHO";
        case 7: return "JULHO";
        case 8: return "AGOSTO";
        case 9: return "SETEMBRO";
        case 10: return "OUTUBRO";
        case 11: return "NOVEMBRO";
        case 12: return "DEZEMBRO";
        default: return "";
    }
}

export const dataMask = {
    mask: '__/__/____',
    replacement: { _: /\d/ },
};

// Função para ignorar acentos no texto (Ex.: José = Jose)
export function normalizar(str: string) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function buildStringDate(date: Date) {
    const newDate = new Date(date);

    const day = newDate.getDate();
    const month = newDate.getMonth() + 1;
    const year = newDate.getFullYear();

    return `${newDate.getDate()}/${String(month).padStart(2, '0')}/${newDate.getFullYear()}`;
}