"use client";

import Link from "next/link";
import ThemeSwitcher from "./theme-switcher";
import { usePathname, useRouter } from "next/navigation";
import { FaAddressCard, FaArchive, FaCalendarAlt, FaHome, FaLock, FaPhoneSquareAlt, FaTag, FaUser } from "react-icons/fa";
import { BsPrinterFill } from "react-icons/bs";
import { MdLogout } from "react-icons/md";
import MenuSwitcher from "./menu-switcher";
import { signOut } from "next-auth/react";

export default function Menu() {
    const pathname = usePathname();

    const excludeRoutes = ['/login', '/cadastrar', '/ramal'];

    const showMenu = !excludeRoutes.includes(pathname);

    const handleLogout = async () => {
        signOut({ callbackUrl: '/login', redirect: true });
    };

    return (
        <>
        {
            showMenu &&
            <div className="sticky h-12 bg-gray-800 flex justify-center px-10 relative">
                <div className="container flex items-center justify-between">
                    <nav className="flex items-center h-full">
                        <ul className="flex h-full">
                            <li className="relative group h-full">
                                <Link href={ `/locais` } className="h-full flex items-center px-6 py-0 gap-2 hover:bg-gray-700 transition ease-in-out duration-150 font-semibold text-white">
                                    <FaHome size={24} />
                                    Unidades
                                </Link>
                                <ul className="hidden group-hover:flex absolute flex-col bg-gray-800 left-0 w-full">
                                    <li>
                                        <Link href={ `/ramais` } className="h-full flex items-center px-6 py-2 gap-2 hover:bg-gray-700 transition ease-in-out duration-150 font-semibold text-white">
                                            <FaPhoneSquareAlt size={24} />
                                            Ramais
                                        </Link>
                                    </li>
                                </ul>
                            </li>
                            <li className="relative group h-full">
                                <Link href={ `/patrimonios` } className="h-full flex items-center px-6 py-2 gap-2 hover:bg-gray-700 transition ease-in-out duration-150 font-semibold text-white">
                                    <FaTag size={24} />
                                    Patrimônios
                                </Link>
                                <ul className="hidden group-hover:flex absolute flex-col bg-gray-800 left-0 w-full">
                                    <li>
                                        <Link href={ `/tipos` } className="h-full flex items-center px-6 py-2 gap-2 hover:bg-gray-700 transition ease-in-out duration-150 font-semibold text-white">
                                            <FaArchive size={24} />
                                            Tipos
                                        </Link>
                                    </li>
                                </ul>
                            </li>
                            <li className="relative group h-full">
                                <Link href={ `/impressoras` } className="h-full flex items-center px-6 py-2 gap-2 hover:bg-gray-700 transition ease-in-out duration-150 font-semibold text-white">
                                    <BsPrinterFill size={24} />
                                    Impressoras
                                </Link>
                            </li>
                            <li className="relative group h-full">
                                <Link href={ `/funcionarios` } className="h-full flex items-center px-6 py-2 gap-2 hover:bg-gray-700 transition ease-in-out duration-150 font-semibold text-white">
                                    <FaAddressCard size={24} />
                                    Funcionários
                                </Link>
                            </li>
                            <li className="relative group h-full">
                                <Link href={ `/feriados` } className="h-full flex items-center px-6 py-2 gap-2 hover:bg-gray-700 transition ease-in-out duration-150 font-semibold text-white">
                                    <FaCalendarAlt size={24} />
                                    Feriados
                                </Link>
                            </li>
                            <li className="relative group h-full">
                                <Link href={ `/usuarios` } className="h-full flex items-center px-6 py-2 gap-2 hover:bg-gray-700 transition ease-in-out duration-150 font-semibold text-white">
                                    <FaUser size={24} />
                                    Usuários
                                </Link>
                                <ul className="hidden group-hover:flex absolute flex-col bg-gray-800 left-0 w-52">
                                    <li>
                                        <Link href={ `/niveis` } className="h-full flex items-center px-6 py-2 gap-2 hover:bg-gray-700 transition ease-in-out duration-150 font-semibold text-white">
                                            <FaLock size={24} />
                                            Níveis de Acesso
                                        </Link>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </nav>
                    <div className="flex items-center gap-4 h-full">
                        <button onClick={() => handleLogout()} className="cursor-pointer flex items-center justify-center gap-1 text-white font-medium text-sm uppercase hover:text-orange-200 transition ease-in-out duration-150">
                            <MdLogout size={24} />
                            Logout
                        </button>
                        <ThemeSwitcher />
                        <MenuSwitcher />
                    </div>
                </div>
            </div>
        }
        </>
    );
}