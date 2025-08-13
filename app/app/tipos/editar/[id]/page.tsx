import TiposForm from "@/components/forms/tiposForm";

type Params = Promise<{ id: number }>;

export default async function Editar({ params }: { params: Params }) {
    const { id } = await params;

    return (
        <>
        <TiposForm id={id} />
        </>
    );
};