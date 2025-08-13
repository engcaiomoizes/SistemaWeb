interface Props {
    children: React.ReactNode;
    bgColor?: 'blue' | 'orange' | 'red' | 'green' | 'yellow' | 'purple' | 'default';
}

export default function Badge({
    children,
    bgColor = 'default',
}: Props) {
    return (
        <div className={`flex justify-center items-center w-fit rounded-full ${bgColor != 'default' ? `bg-${bgColor}-600` : 'bg-accent-foreground'} px-3 py-0.5 cursor-pointer`}>
            <span className="text-xs text-accent">{children}</span>
        </div>
    );
}