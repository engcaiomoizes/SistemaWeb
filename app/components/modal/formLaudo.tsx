import { Patrimonio } from "@/types/patrimonio";
import { FaChevronLeft } from "react-icons/fa";
import RichTextEditor from "../rich-text-editor";
import { useEffect, useState } from "react";

interface Props {
    // itens: Patrimonio[];
    content?: string;
    isOpen: boolean;
    onClose: () => void;
    onSave: (texto: string) => void;
}

export default function FormLaudo({
    content,
    isOpen,
    onClose,
    onSave
}: Props) {
    const [texto, setTexto] = useState("");
    const onChange = (content: string) => {
        setTexto(content);
    }

    const handleCancelar = () => {
        // setTexto("");
        onClose();
    };

    useEffect(() => {
        if (content) {
            setTexto(content);
        }
    }, [content]);

    if (!isOpen) return null;

    return (
        <div className="flex flex-col justify-center relative gap-2">
            <div className="flex">
                <a role="button" onClick={onClose} className="cursor-pointer flex items-center font-medium gap-1 text-sm"><FaChevronLeft size={12} /> Voltar</a>
            </div>
            <div className="flex flex-col gap-1">
                <span className="text-sm font-medium">Texto do Laudo Técnico:</span>
                <RichTextEditor content={texto} onChange={onChange} />
            </div>
            <div className="flex items-center gap-4">
                <button onClick={() => onSave(texto)} className="cursor-pointer w-1/2 border bg-blue-600 border-blue-600 rounded text-white py-1 uppercase font-medium hover:bg-blue-800 hover:border-blue-800 transition ease-in-out duration-150">Salvar</button>
                <button onClick={handleCancelar} className="cursor-pointer w-1/2 border border-red-600 rounded text-red-600 py-1 uppercase font-medium hover:bg-red-600 hover:text-white transition ease-in-out duration-150">Cancelar</button>
            </div>
        </div>
    );
}