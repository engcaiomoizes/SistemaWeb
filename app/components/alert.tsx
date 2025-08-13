interface Props {
    children: React.ReactNode;
    type?: 'success' | 'error' | 'warning' | 'default' | 'secondary';
    className?: string;
    onClose: () => void;
}

export default function Alert({
    children,
    type,
    className,
    onClose,
}: Props) {
    if (!children) return;

    switch (type) {
        case 'success':
            return (
                <div id="alert-2" className={`${className} relative flex items-center p-4 pe-12 my-4 rounded-lg bg-green-200`} role="alert">
                    <svg className="shrink-0 w-4 h-4 text-green-900" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                    </svg>
                    <span className="sr-only">Info</span>
                    <div className="ms-3 text-sm font-medium text-green-900">
                        {children}
                    </div>
                    <button type="button" onClick={onClose} className="absolute end-2 bg-green-200 text-green-900 rounded-lg focus:ring-2 focus:ring-green-400 p-1.5 inline-flex items-center justify-center h-7 w-7 cursor-pointer hover:bg-green-300" data-dismiss-target="#alert-2" aria-label="Close">
                        <span className="sr-only">Close</span>
                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                        </svg>
                    </button>
                </div>
            );
            break;
        case 'error':
            return (
                <div id="alert-2" className={`${className} relative flex items-center p-4 pe-12 my-4 rounded-lg bg-red-200`} role="alert">
                    <svg className="shrink-0 w-4 h-4 text-red-900" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                    </svg>
                    <span className="sr-only">Info</span>
                    <div className="ms-3 text-sm font-medium text-red-900">
                        {children}
                    </div>
                    <button type="button" onClick={onClose} className="absolute end-2 bg-red-200 text-red-900 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 inline-flex items-center justify-center h-7 w-7 cursor-pointer hover:bg-red-300" data-dismiss-target="#alert-2" aria-label="Close">
                        <span className="sr-only">Close</span>
                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                        </svg>
                    </button>
                </div>
            );
            break;
        case 'warning':
            return (
                <div id="alert-2" className={`${className} relative flex items-center p-4 pe-12 my-4 rounded-lg bg-orange-200`} role="alert">
                    <svg className="shrink-0 w-4 h-4 text-orange-900" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                    </svg>
                    <span className="sr-only">Info</span>
                    <div className="ms-3 text-sm font-medium text-orange-900">
                        {children}
                    </div>
                    <button type="button" onClick={onClose} className="absolute end-2 bg-orange-200 text-orange-900 rounded-lg focus:ring-2 focus:ring-orange-400 p-1.5 inline-flex items-center justify-center h-7 w-7 cursor-pointer hover:bg-orange-300" data-dismiss-target="#alert-2" aria-label="Close">
                        <span className="sr-only">Close</span>
                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                        </svg>
                    </button>
                </div>
            );
            break;
        case 'default':
            return (
                <div id="alert-2" className={`${className} relative flex items-center p-4 pe-12 my-4 rounded-lg bg-blue-200`} role="alert">
                    <svg className="shrink-0 w-4 h-4 text-blue-900" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                    </svg>
                    <span className="sr-only">Info</span>
                    <div className="ms-3 text-sm font-medium text-blue-900">
                        {children}
                    </div>
                    <button type="button" onClick={onClose} className="absolute end-2 bg-blue-200 text-blue-900 rounded-lg focus:ring-2 focus:ring-blue-400 p-1.5 inline-flex items-center justify-center h-7 w-7 cursor-pointer hover:bg-blue-300" data-dismiss-target="#alert-2" aria-label="Close">
                        <span className="sr-only">Close</span>
                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                        </svg>
                    </button>
                </div>
            );
            break;
        case 'secondary':
            return (
                <div id="alert-2" className={`${className} relative flex items-center p-4 pe-12 my-4 rounded-lg bg-gray-200`} role="alert">
                    <svg className="shrink-0 w-4 h-4 text-gray-900" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                    </svg>
                    <span className="sr-only">Info</span>
                    <div className="ms-3 text-sm font-medium text-gray-900">
                        {children}
                    </div>
                    <button type="button" onClick={onClose} className="absolute end-2 bg-gray-200 text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-400 p-1.5 inline-flex items-center justify-center h-7 w-7 cursor-pointer hover:bg-gray-300" data-dismiss-target="#alert-2" aria-label="Close">
                        <span className="sr-only">Close</span>
                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                        </svg>
                    </button>
                </div>
            );
            break;
        default:
            return (
                <div id="alert-2" className={`${className} relative flex items-center p-4 pe-12 my-4 rounded-lg bg-blue-200`} role="alert">
                    <svg className="shrink-0 w-4 h-4 text-blue-900" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                    </svg>
                    <span className="sr-only">Info</span>
                    <div className="ms-3 text-sm font-medium text-blue-900">
                        {children}
                    </div>
                    <button type="button" onClick={onClose} className="absolute end-2 bg-blue-200 text-blue-900 rounded-lg focus:ring-2 focus:ring-blue-400 p-1.5 inline-flex items-center justify-center h-7 w-7 cursor-pointer hover:bg-blue-300" data-dismiss-target="#alert-2" aria-label="Close">
                        <span className="sr-only">Close</span>
                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                        </svg>
                    </button>
                </div>
            );
            break;
    }
}