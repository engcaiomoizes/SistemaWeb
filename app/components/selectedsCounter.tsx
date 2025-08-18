interface Props {
    count: number;
    limpar: () => void;
}

export default function SelectedsCounter({ count, limpar }: Props) {
    if (count === 0) return;

    return (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 flex items-center gap-4 py-2 ps-6 pe-3 border rounded bg-yellow-200 border-yellow-400">
            <span className="font-medium text-accent-foreground dark:text-accent">{count} selecionados</span>
            <button onClick={limpar} className="cursor-pointer">
                <svg className="w-5 h-5 text-accent-foreground dark:text-accent" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/>
                </svg>
            </button>
        </div>
    );
}