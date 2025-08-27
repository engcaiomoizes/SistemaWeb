'use client';

import { useRef, useState } from "react";
import { Button } from "../ui/button";

export default function LockPDF() {
    const inputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [senha, setSenha] = useState("");
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type === "application/pdf") {
            setSelectedFile(file);
        } else {
            alert("Por favor, selecione um arquivo PDF válido.");
        }
    };

    const handleLock = async () => {
        if (!selectedFile) {
            alert("Selecione um arquivo PDF primeiro.");
            return;
        }
        if (!senha || senha.length === 0) {
            alert("Informe a senha para seu arquivo PDF.");
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("password", senha);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_PYTHON_API_URL}/protect-pdf`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Erro ao proteger o PDF.");
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = "pdf_protegido.pdf";
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            alert("Falha ao processar o PDF: " + err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center py-4 px-4 bg-white shadow rounded gap-2 dark:bg-gray-800">
            <span className="font-bold text-2xl mb-2">Proteger PDF</span>
            <input type="file" ref={inputRef} onChange={handleFileChange} name="arquivo" id="arquivo" className="hidden" />
            <Button className="cursor-pointer bg-accent-foreground text-accent" onClick={() => inputRef.current?.click()}>{selectedFile ? inputRef.current?.files![0].name : 'Selecionar arquivo'}</Button>
            <input type="text" name="senha" id="senha" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="Senha para o arquivo PDF" className="w-full border-b-2 focus:border-teal-500 py-1.5 px-3 outline-none" />
            <Button className="w-full cursor-pointer bg-accent-foreground text-accent" onClick={handleLock} disabled={loading || !selectedFile}>{loading ? 'Processando...' : 'Proteger PDF'}</Button>
        </div>
    );
}