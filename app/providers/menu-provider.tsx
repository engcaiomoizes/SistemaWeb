'use client';

import Menu from "@/components/menu";
import SideMenu from "@/components/sideMenu";
import { useEffect, useState } from "react";

export default function MenuProvider() {
    const [menu, setMenu] = useState("side");

    useEffect(() => {
        setMenu(localStorage.getItem('menu') ?? 'side');
    }, []);

    if (menu == 'side') return <SideMenu />;
    else return <Menu />;
}