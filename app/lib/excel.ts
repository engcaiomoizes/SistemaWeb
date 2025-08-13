import * as XLSX from 'xlsx';

export const gerarExcel = (data: any[], nomeArquivo: string): Buffer => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
    return excelBuffer;
};