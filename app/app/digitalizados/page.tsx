export default function Digitalizados() {
    return (
        <div className="flex justify-center p-10 ms-12">
            <div className="max-w-4xl xl:container">
                <div className="flex flex-col">
                    <div className="flex items-center gap-6">
                        <input type="text" name="codigo" id="codigo" placeholder="Defina o código da digitalização" className="border px-2 py-1.5 rounded w-64" />
                        <button className="border rounded px-4 py-1.5 bg-red-600 text-white border-red-600 font-medium cursor-pointer">Digitalizar</button>
                    </div>
                </div>
            </div>
        </div>
    );
}