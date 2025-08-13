import NiveisForm from "@/components/forms/niveisForm";

type Params = Promise<{ id: number }>;

export default async function Editar({ params }: { params: Params }) {
    const { id } = await params;

    return (
        <>
        <NiveisForm id={id} />
        </>
    );
};