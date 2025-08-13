import UpdatesForm from "@/components/forms/updatesForm";

type Params = Promise<{ id: number }>;

export default async function Editar({ params }: { params: Params }) {
    const { id } = await params;

    return (
        <>
        <UpdatesForm id={id} />
        </>
    );
};