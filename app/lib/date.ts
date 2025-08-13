export function getWeekly() {
    const today = new Date();

    const inicioSemana = new Date(today);
    const diaSemana = today.getDay();
    inicioSemana.setDate(today.getDate() - diaSemana);

    const fimSemana = new Date(inicioSemana);
    fimSemana.setDate(inicioSemana.getDate() + 6);

    inicioSemana.setUTCHours(0, 0, 0, 0);
    fimSemana.setUTCHours(23, 59, 59, 999);

    return { inicio: inicioSemana, fim: fimSemana };
}

export function isWeekly(date: Date): boolean {
    const periodo = getWeekly();

    const dataRecebida = new Date(date);

    // console.log(periodo.inicio);

    return dataRecebida >= periodo.inicio && dataRecebida <= periodo.fim;
}

export function lastFifteenDays() {
    const fim = new Date();

    const inicio = new Date(fim);
    inicio.setDate(fim.getDate() - 14);

    return { inicio: inicio, fim: fim };
}

export function isInLastFifteenDays(date: Date) {
    const periodo = lastFifteenDays();

    const dataRecebida = new Date(date);

    return dataRecebida >= periodo.inicio && dataRecebida <= periodo.fim;
}

export function lastMonthly() {
    const fim = new Date();

    const inicio = new Date(fim);
    inicio.setDate(fim.getDate() - 30);

    return { inicio, fim };
}

export function isInLastMonthly(date: Date) {
    const periodo = lastMonthly();

    const dataRecebida = new Date(date);

    return dataRecebida >= periodo.inicio && dataRecebida <= periodo.fim;
}

export function getMonth() {
    const today = new Date();

    return today.getMonth();
}