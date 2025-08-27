import { useEffect, useState } from "react";
import { Switch } from "./ui/switch";

export default function MenuSwitcher() {
    const [menu, setMenu] = useState("side");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setMenu(localStorage.getItem('menu') ?? 'side');
    }, []);

    const handleChange = () => {
        if (menu == 'side') {
            localStorage.setItem('menu', 'top');
            setMenu('top');
        } else {
            localStorage.setItem('menu', 'side');
            setMenu('side');
        }
        setLoading(true);
        window.location.reload();
    };

    return (
        <div className="flex items-center gap-1">
            <Switch className="cursor-pointer" disabled={loading} checked={menu == 'side'} onCheckedChange={handleChange} />
            <span className="text-sm text-white">Menu lateral</span>
        </div>
    );
}