import FeriadosForm from "@/components/forms/feriadosForm";

type Params = Promise<{ id: number }>;

export default async function Editar({ params }: { params: Params }) {
    const { id } = await params;

    return (
        <>
        <FeriadosForm id={id} />
        </>
    );
};