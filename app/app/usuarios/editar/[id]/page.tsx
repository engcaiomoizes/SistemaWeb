import UsuariosForm from "@/components/forms/usuariosForm";

type Params = Promise<{ id: number }>;

export default async function Editar({ params }: { params: Params }) {
    const { id } = await params;

    return (
        <>
        <UsuariosForm id={id} />
        </>
    );
};