import React, { useState } from "react";
import axios from "axios";

interface UploadResponse {
    id: string;
    pages: string[];
}

interface PdfUploadProps {
    onUploadSuccess: (data: any) => void;
}

const PdfUpload: React.FC<PdfUploadProps> = ({ onUploadSuccess }) => {
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            alert("Por favor, selecione um arquivo PDF.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_PYTHON_API_URL}/upload`, {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                onUploadSuccess(data);
            }
        } catch (err) {
            console.error("Erro no upload:", err);
        }
    };

    return (
        <div>
            <h2>Upload do PDF</h2>
            <input type="file" accept="application/pdf" onChange={handleFileChange} />
            <button onClick={handleUpload}>Enviar PDF</button>
        </div>
    )
}

export default PdfUpload;