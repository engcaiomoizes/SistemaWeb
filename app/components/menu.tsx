"use client";

import Link from "next/link";
import ThemeSwitcher from "./theme-switcher";
import { usePathname, useRouter } from "next/navigation";

export default function Menu() {
    const pathname = usePathname();

    const excludeRoutes = ['/login', '/cadastrar'];

    const showMenu = !excludeRoutes.includes(pathname);

    const { push } = useRouter();

    const handleLogout = async () => {
        try {
            const response = await fetch('/api/login', {
                method: 'DELETE',
            });

            const data = await response.json();

            console.log(data);

            if (response.ok) {
                push('/login');
            } else {
                //
            }
        } catch (err) {
            console.log(err);
        } finally {
            //
        }
    }

    return (
        <>
        {
            showMenu &&
            <div className="sticky h-12 bg-gray-800 flex px-10 relative">
                <div className="flex items-center">
                    <ul className="flex">
                        <li className="">
                            <Link href={ `/` } className="h-full flex items-center px-6 py-2 hover:bg-gray-700 transition ease-in-out duration-150 uppercase text-sm font-semibold text-white">Home</Link>
                        </li>
                        <li className="">
                            <Link href={ `/locais` } className="h-full flex items-center px-6 py-2 hover:bg-gray-700 transition ease-in-out duration-150 uppercase text-sm font-semibold text-white">Locais</Link>
                        </li>
                        <li className="">
                            <Link href={ `/tipos` } className="h-full flex items-center px-6 py-2 hover:bg-gray-700 transition ease-in-out duration-150 uppercase text-sm font-semibold text-white">Tipos</Link>
                        </li>
                        <li className="">
                            <Link href={ `/patrimonios` } className="h-full flex items-center px-6 py-2 hover:bg-gray-700 transition ease-in-out duration-150 uppercase text-sm font-semibold text-white">Patrimônios</Link>
                        </li>
                        <li className="">
                            <Link href={ `/usuarios` } className="h-full flex items-center px-6 py-2 hover:bg-gray-700 transition ease-in-out duration-150 uppercase text-sm font-semibold text-white">Usuários</Link>
                        </li>
                    </ul>
                </div>
                <div className="absolute top-0 right-2 md:right-8 w-auto h-12 p-4 flex items-center justify-center">
                    <button className="me-10 flex items-center justify-center" onClick={() => handleLogout()}>
                        <svg className="w-6 h-6 me-1 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H8m12 0-4 4m4-4-4-4M9 4H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h2"/>
                        </svg>
                        <span className="font-bold text-xs uppercase text-white dark:text-white">Logout</span>
                    </button>
                    <ThemeSwitcher />
                </div>
            </div>
        }
        </>
    );
}