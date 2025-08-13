'use client';

import { useRef, useState } from "react";
import { Button } from "../ui/button";

export default function JuntarPDF() {
    const inputRef = useRef<HTMLInputElement>(null);
    const [files, setFiles] = useState<FileList | null>(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type === "application/pdf") {
            //setSelectedFile(file);
        } else {
            alert("Por favor, selecione um arquivo PDF válido.");
        }
    };

    const handleJuntar = async () => {
        if (!files || files.length < 2) {
            alert("Selecione pelo menos 2 arquivos PDF.");
            return;
        }

        setLoading(true);

        const formData = new FormData();
        Array.from(files).forEach((file) => formData.append("files", file));

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_PYTHON_API_URL}/merge-pdf`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Erro ao processar PDFs.");
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "pdf-unificado.pdf";
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            alert("Erro ao enviar arquivos: " + err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center py-4 px-4 bg-white shadow rounded gap-2">
            <span className="font-bold text-2xl mb-2">Juntar PDF</span>
            <input type="file" accept="application/pdf" multiple ref={inputRef} onChange={(e) => setFiles(e.target.files)} name="arquivo" id="arquivo" className="hidden" />
            <Button className="cursor-pointer" onClick={() => inputRef.current?.click()}>{(files && files.length > 0) ? `${files.length} arquivos` : 'Selecionar arquivos'}</Button>
            <Button className="w-full cursor-pointer" onClick={handleJuntar} disabled={loading || (!files || files.length < 2)}>{loading ? 'Processando...' : 'Juntar PDF'}</Button>
        </div>
    );
}