export default function StatusDot({ status }: { status: 'online' | 'offline' }) {
    if (status === 'online') {
        return <div className="w-5 h-5 rounded-full bg-green-600 border border-green-800 shadow" title="Online"></div>;
    } else if (status === 'offline') {
        return <div className="w-5 h-5 rounded-full bg-red-600 border border-red-800 shadow" title="Offline"></div>;
    } else return;
}