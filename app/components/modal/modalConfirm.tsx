import { Button } from "../ui/button";

interface Props {
    isOpen: boolean;
    texto: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ModalConfirm({ isOpen, texto, onConfirm, onCancel }: Props) {
    if (!isOpen) return null;

    return (
        <div className="absolute top-0 left-0">
            <div className="fixed top-0 left-0 z-30">
                <div className="fixed flex flex-col items-center gap-4 bg-white dark:bg-gray-800 px-6 pt-4 pb-6 left-1/2 top-10 -translate-x-1/2 rounded-lg max-h-[640px] min-w-96 shadow-lg">
                    <span className="font-bold text-lg">{texto}</span>
                    <div className="flex justify-end gap-2 w-full">
                        <Button className="cursor-pointer" onClick={onConfirm}>Sim</Button>
                        <Button className="cursor-pointer" onClick={onCancel}>Não</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}