'use client';

import JuntarPDF from "@/components/pdf/juntarPdf";
import LockPDF from "@/components/pdf/lockPdf";
import SepararPDF from "@/components/pdf/separarPdf";
import PdfUpload from "@/components/pdf/uploadPdf";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";

export default function PDF() {
    const [uploadResponse, setUploadResponse] = useState<any>(null);

    const handleUploadResponse = (data: any) => {
        setUploadResponse(data);
    };

    return (
        <div className="flex justify-center p-10 ms-12">
            <div className="max-w-4xl xl:container">
                <div className="flex flex-col gap-6">
                    <SepararPDF />
                    <JuntarPDF />
                    <LockPDF />
                    <PdfUpload onUploadSuccess={handleUploadResponse} />
                    {
                        uploadResponse && (
                            <div>
                                <h2>Resposta do Backend:</h2>
                                <pre>{JSON.stringify(uploadResponse, null, 2)}</pre>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    );
}