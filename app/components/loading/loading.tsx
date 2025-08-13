import { Loader2 } from "lucide-react";

export default function Loading({ text = "Carregando..." } : { text?: string }) {
    return (
        <div className="flex items-center justify-center flex-col gap-4 text-muted-foreground">
            <Loader2 className="h-10 w-10 animate-spin" />
            <p className="text-sm">{text}</p>
        </div>
    );
}