import FuncionariosForm from "@/components/forms/funcionariosForm";

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
        <FuncionariosForm id={id} />
        </>
    );
};