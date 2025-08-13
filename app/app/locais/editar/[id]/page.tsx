import LocaisForm from "@/components/forms/locaisForm";
import { NextPage } from "next"

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
        <LocaisForm id={id} />
        </>
    );
};