'use client';

import { useRef, useState } from "react";
import { Button } from "../ui/button";

export default function SepararPDF() {
    const inputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type === "application/pdf") {
            setSelectedFile(file);
        } else {
            alert("Por favor, selecione um arquivo PDF válido.");
        }
    };

    const handleSeparar = async () => {
        if (!selectedFile) {
            alert("Selecione um arquivo PDF primeiro.");
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_PYTHON_API_URL}/split-pdf`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Erro ao separar o PDF.");
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = "pdf_separado.zip";
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            alert("Falha ao processar o PDF: " + err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center py-4 px-4 bg-white shadow rounded gap-2">
            <span className="font-bold text-2xl mb-2">Separar PDF</span>
            <input type="file" ref={inputRef} onChange={handleFileChange} name="arquivo" id="arquivo" className="hidden" />
            <Button className="cursor-pointer" onClick={() => inputRef.current?.click()}>{selectedFile ? inputRef.current?.files![0].name : 'Selecionar arquivo'}</Button>
            <Button className="w-full cursor-pointer" onClick={handleSeparar} disabled={loading || !selectedFile}>{loading ? 'Processando...' : 'Separar PDF'}</Button>
        </div>
    );
}