import PatrimoniosForm from "@/components/forms/patrimoniosForm";

type Params = Promise<{ id: number }>;

export default async function Editar({ params }: { params: Params }) {
    const { id } = await params;

    return (
        <>
        <PatrimoniosForm id={id} />
        </>
    );
};