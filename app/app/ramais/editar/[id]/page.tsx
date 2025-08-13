import RamaisForm from "@/components/forms/ramaisForm";

type Params = Promise<{ id: number }>;

export default async function Editar({ params }: { params: Params }) {
    const { id } = await params;

    return (
        <>
        <RamaisForm id={id} />
        </>
    );
};