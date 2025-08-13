import ImpressorasForm from "@/components/forms/impressorasForm";

interface Props {
    params: {
        id: number
    }
}

type Params = Promise<{ id: number }>;

export default async function Editar({ params }: { params: Params }) {
    const { id } = await params;

    return (
        <>
        <ImpressorasForm id={id} />
        </>
    );
};