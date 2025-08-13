'use client';

import Link from "next/link";
import { useState } from "react";
import ThemeSwitcher from "./theme-switcher";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { FaFilePdf } from "react-icons/fa6";

export default function SideMenu() {
    const [fullMenu, setFullMenu] = useState(false);
    
    const pathname = usePathname();

    const excludeRoutes = ['/login', '/cadastrar', '/teste', '/maintenance'];

    const showMenu = !excludeRoutes.includes(pathname);

    const { push } = useRouter();

    const { data: session, status } = useSession();

    const handleLogout = async () => {
        signOut({ callbackUrl: '/login', redirect: true });
    };

    const [openPass, setOpenPass] = useState(false);
    const [novaSenha, setNovaSenha] = useState("");
    const [confirmaNovaSenha, setConfirmaNovaSenha] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [showNotifications, setShowNotifications] = useState(false);

    const handleFechar = () => {
        setNovaSenha("");
        setConfirmaNovaSenha("");
        setOpenPass(false);
    };

    const handleSubmit = async () => {
        try {
            if (novaSenha.length == 0 || confirmaNovaSenha.length == 0) {
                setError("Preencha todos os campos.");
                return;
            }
            
            if (novaSenha != confirmaNovaSenha) {
                setError("As senhas não coincidem.");
                return;
            }

            const response = await fetch('/api/cadastrar', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: session?.user.id,
                    novaSenha: novaSenha,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                handleFechar();
                setMessage(data.message);
            } else {
                //
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <>
        {
            showMenu &&
            <>
            <div className={`fixed ${fullMenu ? 'w-72' : 'w-16'} h-full z-20 bg-gray-800 text-white shadow-md transition-all duration-300 ease-in-out overflow-y-auto overflow-x-hidden scrollbar scrollbar-thin scrollbar-track-red-200`} onMouseEnter={() => setFullMenu(true)} onMouseLeave={() => setFullMenu(false)}>
                <div className="sticky flex flex-col top-0 left-0 w-16 py-2 relative h-full">
                    <Link href={ `/` }>
                        <div className="flex items-center w-72 mb-4 hover:bg-gray-600">
                            <div className="flex items-center justify-center h-12 w-16">
                                <img src="/static/img/logo_white_aracatuba.png" alt="" className="w-8 h-8" />
                            </div>
                            <span className={`${fullMenu ? '' : 'hidden'} font-light px-2 font-medium`}>Página Inicial</span>
                        </div>
                    </Link>
                    <div className={`overflow-y-auto overflow-x-hidden w-72 max-h-[60%]`}>
                        {/* <Link href={ `/treinamentos` }>
                            <div className="flex items-center w-72 hover:bg-gray-600">
                                <div className="flex items-center justify-center h-12 w-16">
                                    <svg className="w-8 h-8" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 6H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1Zm7 11-6-2V9l6-2v10Z"/>
                                    </svg>
                                </div>
                                <span className={`${fullMenu ? '' : 'hidden'} font-light px-2 font-medium`}>Treinamentos</span>
                            </div>
                        </Link> */}
                        <Link href={ `/locais` } className={`${session?.user.cadastrar_locais ? '' : 'hidden'}`}>
                            <div className="flex items-center w-72 hover:bg-gray-600">
                                <div className="flex items-center justify-center h-12 w-16">
                                    <svg className="w-8 h-8" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                        <path fillRule="evenodd" d="M11.293 3.293a1 1 0 0 1 1.414 0l6 6 2 2a1 1 0 0 1-1.414 1.414L19 12.414V19a2 2 0 0 1-2 2h-3a1 1 0 0 1-1-1v-3h-2v3a1 1 0 0 1-1 1H7a2 2 0 0 1-2-2v-6.586l-.293.293a1 1 0 0 1-1.414-1.414l2-2 6-6Z" clipRule="evenodd"/>
                                    </svg>
                                </div>
                                <span className={`${fullMenu ? '' : 'hidden'} font-light px-2 font-medium`}>Unidades</span>
                            </div>
                        </Link>
                        <Link href={ `/ramais` } className={`${session?.user.cadastrar_ramais ? '' : 'hidden'}`}>
                            <div className="flex items-center w-72 hover:bg-gray-600">
                                <div className="flex items-center justify-center h-12 w-16">
                                    <svg className="w-8 h-8" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M7.978 4a2.553 2.553 0 0 0-1.926.877C4.233 6.7 3.699 8.751 4.153 10.814c.44 1.995 1.778 3.893 3.456 5.572 1.68 1.679 3.577 3.018 5.57 3.459 2.062.456 4.115-.073 5.94-1.885a2.556 2.556 0 0 0 .001-3.861l-1.21-1.21a2.689 2.689 0 0 0-3.802 0l-.617.618a.806.806 0 0 1-1.14 0l-1.854-1.855a.807.807 0 0 1 0-1.14l.618-.62a2.692 2.692 0 0 0 0-3.803l-1.21-1.211A2.555 2.555 0 0 0 7.978 4Z"/>
                                    </svg>
                                </div>
                                <span className={`${fullMenu ? '' : 'hidden'} font-light px-2 font-medium`}>Ramais</span>
                            </div>
                        </Link>
                        <Link href={ `/tipos` } className={`${session?.user.cadastrar_tipos ? '' : 'hidden'}`}>
                            <div className="flex items-center w-72 hover:bg-gray-600">
                                <div className="flex items-center justify-center h-12 w-16">
                                    <svg className="w-8 h-8" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                        <path fill-rule="evenodd" d="M20 10H4v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8ZM9 13v-1h6v1a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1Z" clip-rule="evenodd"/>
                                        <path d="M2 6a2 2 0 0 1 2-2h16a2 2 0 1 1 0 4H4a2 2 0 0 1-2-2Z"/>
                                    </svg>
                                </div>
                                <span className={`${fullMenu ? '' : 'hidden'} font-light px-2 font-medium`}>Tipos</span>
                            </div>
                        </Link>
                        <Link href={ `/patrimonios` } className={`${session?.user.cadastrar_patrimonios ? '' : 'hidden'}`}>
                            <div className="flex items-center w-72 hover:bg-gray-600">
                                <div className="flex items-center justify-center h-12 w-16">
                                    <svg className="w-8 h-8" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M18.045 3.007 12.31 3a1.965 1.965 0 0 0-1.4.585l-7.33 7.394a2 2 0 0 0 0 2.805l6.573 6.631a1.957 1.957 0 0 0 1.4.585 1.965 1.965 0 0 0 1.4-.585l7.409-7.477A2 2 0 0 0 21 11.479v-5.5a2.972 2.972 0 0 0-2.955-2.972Zm-2.452 6.438a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"/>
                                    </svg>
                                </div>
                                <span className={`${fullMenu ? '' : 'hidden'} font-light px-2 font-medium`}>Patrimônios</span>
                            </div>
                        </Link>
                        <Link href={ `/impressoras` } className={`${session?.user.cadastrar_patrimonios ? '' : 'hidden'}`}>
                            <div className="flex items-center w-72 hover:bg-gray-600">
                                <div className="flex items-center justify-center h-12 w-16">
                                    <svg className="w-8 h-8" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                        <path fill-rule="evenodd" d="M8 3a2 2 0 0 0-2 2v3h12V5a2 2 0 0 0-2-2H8Zm-3 7a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h1v-4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v4h1a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2H5Zm4 11a1 1 0 0 1-1-1v-4h8v4a1 1 0 0 1-1 1H9Z" clip-rule="evenodd"/>
                                    </svg>
                                </div>
                                <span className={`${fullMenu ? '' : 'hidden'} font-light px-2 font-medium`}>Impressoras</span>
                            </div>
                        </Link>
                        <Link href={ `/funcionarios` } className={`${session?.user.cadastrar_funcionarios ? '' : 'hidden'}`}>
                            <div className="flex items-center w-72 hover:bg-gray-600">
                                <div className="flex items-center justify-center h-12 w-16">
                                    <svg className="w-8 h-8" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                        <path fill-rule="evenodd" d="M4 4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H4Zm10 5a1 1 0 0 1 1-1h3a1 1 0 1 1 0 2h-3a1 1 0 0 1-1-1Zm0 3a1 1 0 0 1 1-1h3a1 1 0 1 1 0 2h-3a1 1 0 0 1-1-1Zm0 3a1 1 0 0 1 1-1h3a1 1 0 1 1 0 2h-3a1 1 0 0 1-1-1Zm-8-5a3 3 0 1 1 6 0 3 3 0 0 1-6 0Zm1.942 4a3 3 0 0 0-2.847 2.051l-.044.133-.004.012c-.042.126-.055.167-.042.195.006.013.02.023.038.039.032.025.08.064.146.155A1 1 0 0 0 6 17h6a1 1 0 0 0 .811-.415.713.713 0 0 1 .146-.155c.019-.016.031-.026.038-.04.014-.027 0-.068-.042-.194l-.004-.012-.044-.133A3 3 0 0 0 10.059 14H7.942Z" clip-rule="evenodd"/>
                                    </svg>
                                </div>
                                <span className={`${fullMenu ? '' : 'hidden'} font-light px-2 font-medium`}>Funcionários</span>
                            </div>
                        </Link>
                        <Link href={ `/feriados` } className={`${session?.user.cadastrar_feriados ? '' : 'hidden'}`}>
                            <div className="flex items-center w-72 hover:bg-gray-600">
                                <div className="flex items-center justify-center h-12 w-16">
                                    <svg className="w-8 h-8" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                        <path fill-rule="evenodd" d="M5 5a1 1 0 0 0 1-1 1 1 0 1 1 2 0 1 1 0 0 0 1 1h1a1 1 0 0 0 1-1 1 1 0 1 1 2 0 1 1 0 0 0 1 1h1a1 1 0 0 0 1-1 1 1 0 1 1 2 0 1 1 0 0 0 1 1 2 2 0 0 1 2 2v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a2 2 0 0 1 2-2ZM3 19v-7a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Zm6.01-6a1 1 0 1 0-2 0 1 1 0 0 0 2 0Zm2 0a1 1 0 1 1 2 0 1 1 0 0 1-2 0Zm6 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0Zm-10 4a1 1 0 1 1 2 0 1 1 0 0 1-2 0Zm6 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0Zm2 0a1 1 0 1 1 2 0 1 1 0 0 1-2 0Z" clip-rule="evenodd"/>
                                    </svg>
                                </div>
                                <span className={`${fullMenu ? '' : 'hidden'} font-light px-2 font-medium`}>Feriados</span>
                            </div>
                        </Link>
                        <Link href={ `/usuarios` } className={`${session?.user.cadastrar_usuarios ? '' : 'hidden'}`}>
                            <div className="flex items-center w-72 hover:bg-gray-600">
                                <div className="flex items-center justify-center h-12 w-16">
                                    <svg className="w-8 h-8" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                        <path fill-rule="evenodd" d="M8 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4H6Zm7.25-2.095c.478-.86.75-1.85.75-2.905a5.973 5.973 0 0 0-.75-2.906 4 4 0 1 1 0 5.811ZM15.466 20c.34-.588.535-1.271.535-2v-1a5.978 5.978 0 0 0-1.528-4H18a4 4 0 0 1 4 4v1a2 2 0 0 1-2 2h-4.535Z" clip-rule="evenodd"/>
                                    </svg>
                                </div>
                                <span className={`${fullMenu ? '' : 'hidden'} font-light px-2 font-medium`}>Usuários</span>
                            </div>
                        </Link>
                        <Link href={ `/niveis` } className={`${session?.user.cadastrar_niveis ? '' : 'hidden'}`}>
                            <div className="flex items-center w-72 hover:bg-gray-600">
                                <div className="flex items-center justify-center h-12 w-16">
                                    <svg className="w-8 h-8" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                        <path fill-rule="evenodd" d="M8 10V7a4 4 0 1 1 8 0v3h1a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h1Zm2-3a2 2 0 1 1 4 0v3h-4V7Zm2 6a1 1 0 0 1 1 1v3a1 1 0 1 1-2 0v-3a1 1 0 0 1 1-1Z" clip-rule="evenodd"/>
                                    </svg>
                                </div>
                                <span className={`${fullMenu ? '' : 'hidden'} font-light px-2 font-medium`}>Níveis de acesso</span>
                            </div>
                        </Link>
                        <Link href={ `/pdf` } className={`${session?.user.cadastrar_niveis ? '' : 'hidden'}`}>
                            <div className="flex items-center w-72 hover:bg-gray-600">
                                <div className="flex items-center justify-center h-12 w-16">
                                    <FaFilePdf className="size-6" />
                                </div>
                                <span className={`${fullMenu ? '' : 'hidden'} font-light px-2 font-medium`}>Utilitários PDF</span>
                            </div>
                        </Link>
                        <Link href={ `/updates` } className={`${session?.user.cadastrar_updates ? '' : 'hidden'}`}>
                            <div className="flex items-center w-72 hover:bg-gray-600">
                                <div className="flex items-center justify-center h-12 w-16">
                                    <svg className="w-8 h-8" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                        <path fill-rule="evenodd" d="M12 3a1 1 0 0 1 .78.375l4 5a1 1 0 1 1-1.56 1.25L13 6.85V14a1 1 0 1 1-2 0V6.85L8.78 9.626a1 1 0 1 1-1.56-1.25l4-5A1 1 0 0 1 12 3ZM9 14v-1H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-4v1a3 3 0 1 1-6 0Zm8 2a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2H17Z" clip-rule="evenodd"/>
                                    </svg>
                                </div>
                                <span className={`${fullMenu ? '' : 'hidden'} font-light px-2 font-medium`}>Updates</span>
                            </div>
                        </Link>
                        <Link href={ `/patch-notes` }>
                            <div className="flex items-center w-72 hover:bg-gray-600">
                                <div className="flex items-center justify-center h-12 w-16">
                                    <svg className="w-8 h-8" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.651 7.65a7.131 7.131 0 0 0-12.68 3.15M18.001 4v4h-4m-7.652 8.35a7.13 7.13 0 0 0 12.68-3.15M6 20v-4h4"/>
                                    </svg>
                                </div>
                                <span className={`${fullMenu ? '' : 'hidden'} font-light px-2 font-medium`}>Notas de atualização</span>
                            </div>
                        </Link>
                    </div>
                    <div className="absolute bottom-0">
                        <Link href={ `/perfil` }>
                            <div className="flex items-center w-72 hover:bg-gray-600">
                                <div className="flex items-center justify-center h-12 w-16">
                                    <svg className="w-8 h-8 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                        <path fill-rule="evenodd" d="M4 4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H4Zm10 5a1 1 0 0 1 1-1h3a1 1 0 1 1 0 2h-3a1 1 0 0 1-1-1Zm0 3a1 1 0 0 1 1-1h3a1 1 0 1 1 0 2h-3a1 1 0 0 1-1-1Zm0 3a1 1 0 0 1 1-1h3a1 1 0 1 1 0 2h-3a1 1 0 0 1-1-1Zm-8-5a3 3 0 1 1 6 0 3 3 0 0 1-6 0Zm1.942 4a3 3 0 0 0-2.847 2.051l-.044.133-.004.012c-.042.126-.055.167-.042.195.006.013.02.023.038.039.032.025.08.064.146.155A1 1 0 0 0 6 17h6a1 1 0 0 0 .811-.415.713.713 0 0 1 .146-.155c.019-.016.031-.026.038-.04.014-.027 0-.068-.042-.194l-.004-.012-.044-.133A3 3 0 0 0 10.059 14H7.942Z" clip-rule="evenodd"/>
                                    </svg>
                                </div>
                                <span className={`${fullMenu ? '' : 'hidden'} font-light px-2 font-medium`}>Perfil</span>
                            </div>
                        </Link>
                        <button className="cursor-pointer" onClick={() => setOpenPass(true)}>
                            <div className="flex items-center w-72 hover:bg-gray-600">
                                <div className="flex items-center justify-center h-12 w-16">
                                    <svg className="w-8 h-8 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14v3m-3-6V7a3 3 0 1 1 6 0v4m-8 0h10a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1Z"/>
                                    </svg>
                                </div>
                                <span className={`${fullMenu ? '' : 'hidden'} font-light px-2 font-medium`}>Trocar senha</span>
                            </div>
                        </button>
                        <button className="cursor-pointer" onClick={() => handleLogout()}>
                            <div className="flex items-center w-72 hover:bg-gray-600">
                                <div className="flex items-center justify-center h-12 w-16">
                                    <svg className="w-8 h-8 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H8m12 0-4 4m4-4-4-4M9 4H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h2"/>
                                    </svg>
                                </div>
                                <span className={`${fullMenu ? '' : 'hidden'} font-light px-2 font-medium`}>Logout</span>
                            </div>
                        </button>
                        <div className="flex w-16 py-4 justify-center">
                            <ThemeSwitcher />
                        </div>
                    </div>
                </div>
            </div>

            {/* ALTERAR SENHA */}
            <div className="absolute top-0 left-0">
                <div className={`${openPass ? '' : 'hidden'} fixed top-0 left-0 z-20`}>
                    <div className="fixed top-0 left-0 bg-foreground opacity-40 w-full h-full" onClick={handleFechar}></div>
                    <div className="fixed bg-white dark:bg-gray-800 px-6 pt-4 pb-6 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg max-h-[640px] min-w-96 shadow-lg">
                        <div className="flex items-center relative mb-4">
                            <span className="font-bold uppercase">Trocar senha</span>
                            <button className="absolute right-0 cursor-pointer" onClick={handleFechar}>
                                <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6"/>
                                </svg>
                            </button>
                        </div>
                        <div className="flex flex-col">
                            <div className="flex flex-col group relative w-full h-12 mb-2">
                                <label htmlFor="novaSenha" className={`text-gray-600 absolute bottom-1.5 z-10 cursor-text group-focus-within:text-teal-500 group-focus-within:text-sm group-focus-within:cursor-default dark:text-gray-400 group-focus-within:-translate-y-5 ${novaSenha ? '-translate-y-5 text-sm' : ''} transition-all ease-in-out duration-300`}>Nova senha</label>
                                <input type="password" name="novaSenha" id="novaSenha" value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} className="absolute bottom-0 border-b outline-none dark:bg-gray-800 focus:border-b-2 focus:border-teal-500 w-full" required />
                            </div>
                            <div className="flex flex-col group relative w-full h-12 mb-2">
                                <label htmlFor="confirmaNovaSenha" className={`text-gray-600 absolute bottom-1.5 z-10 cursor-text group-focus-within:text-teal-500 group-focus-within:text-sm group-focus-within:cursor-default dark:text-gray-400 group-focus-within:-translate-y-5 ${confirmaNovaSenha ? '-translate-y-5 text-sm' : ''} transition-all ease-in-out duration-300`}>Confirmar Nova senha</label>
                                <input type="password" name="confirmaNovaSenha" id="confirmaNovaSenha" value={confirmaNovaSenha} onChange={(e) => setConfirmaNovaSenha(e.target.value)} className="absolute bottom-0 border-b outline-none dark:bg-gray-800 focus:border-b-2 focus:border-teal-500 w-full" required />
                            </div>
                            {
                                error &&
                                <span className="text-red-600 text-sm text-center">{error}</span>
                            }
                            <button className="cursor-pointer border rounded border-gray-800 bg-gray-800 text-white dark:border-white dark:bg-white dark:text-gray-800 uppercase font-medium text-sm py-2 mt-3 flex justify-center items-center hover:bg-white hover:text-gray-800 hover:dark:bg-gray-800 hover:dark:text-white transition ease-in-out duration-150" onClick={handleSubmit}>Trocar senha</button>
                        </div>
                    </div>
                </div>
            </div>

            {
                message &&
                <div id="toast-success" className="absolute bottom-0 left-20 flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800" role="alert">
                    <div className="inline-flex items-center justify-center shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                        </svg>
                        <span className="sr-only">Check icon</span>
                    </div>
                    <div className="ms-3 text-sm font-medium">{message}</div>
                    <button type="button" onClick={() => setMessage("")} className="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" data-dismiss-target="#toast-success" aria-label="Close">
                        <span className="sr-only">Close</span>
                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                        </svg>
                    </button>
                </div>
            }

            {/* NOTIFICAÇÕES */}
            <div className="absolute right-0 flex w-16 py-4 justify-center hidden">
                <button className="relative cursor-pointer" onClick={() => setShowNotifications(!showNotifications)}>
                    <svg className="w-8 h-8 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.133 12.632v-1.8a5.406 5.406 0 0 0-4.154-5.262.955.955 0 0 0 .021-.106V3.1a1 1 0 0 0-2 0v2.364a.955.955 0 0 0 .021.106 5.406 5.406 0 0 0-4.154 5.262v1.8C6.867 15.018 5 15.614 5 16.807 5 17.4 5 18 5.538 18h12.924C19 18 19 17.4 19 16.807c0-1.193-1.867-1.789-1.867-4.175ZM8.823 19a3.453 3.453 0 0 0 6.354 0H8.823Z"/>
                    </svg>
                    <div className="absolute inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-red-500 border-0 border-white rounded-full -top-1 -end-1 dark:border-gray-900">20</div>
                </button>
                <div className={`${showNotifications ? '' : 'hidden'} absolute top-4 -left-48 border border-gray-800 shadow rounded-lg bg-gray-800 dark:bg-gray-800 p-2 w-48 h-64 z-10`}>
                    <div className="flex flex-col items-center max-h-60">
                        <span className="text-white text-base font-bold uppercase border-b pb-1 w-full text-center mb-2">Notificações</span>
                        <div className="w-full flex text-white flex-col items-center space-y-1 overflow-y-auto scrollbar-thin">
                            <div className="bg-background text-foreground rounded w-full p-2 text-xs">
                                <span>Notificação 01</span>
                            </div>
                            <div className="bg-background text-foreground rounded w-full p-2 text-xs">
                                <span>Notificação 01</span>
                            </div>
                            <div className="bg-background text-foreground rounded w-full p-2 text-xs">
                                <span>Notificação 01</span>
                            </div>
                            <div className="bg-background text-foreground rounded w-full p-2 text-xs">
                                <span>Notificação 01</span>
                            </div>
                            <div className="bg-background text-foreground rounded w-full p-2 text-xs">
                                <span>Notificação 01</span>
                            </div>
                            <div className="bg-background text-foreground rounded w-full p-2 text-xs">
                                <span>Notificação 01</span>
                            </div>
                            <div className="bg-background text-foreground rounded w-full p-2 text-xs">
                                <span>Notificação 01</span>
                            </div>
                            <div className="bg-background text-foreground rounded w-full p-2 text-xs">
                                <span>Notificação 01</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </>
        }
        </>
    );
}