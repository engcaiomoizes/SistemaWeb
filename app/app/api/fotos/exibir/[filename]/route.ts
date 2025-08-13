import path from "path";
import fs from 'fs/promises';
import { NextResponse } from "next/server";

const uploadDir = path.join(process.cwd(), 'uploads');

export async function GET(req: Request, { params }: any) {
    try {
        const { filename } = await params;
        const filePath = path.join(uploadDir, filename);

        await fs.access(filePath);

        const fileBuffer = await fs.readFile(filePath);

        const ext = path.extname(filename).toLowerCase();
        let contentType = 'application/octet-stream';
        if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
        else if (ext === '.png') contentType = 'image/png';
        else if (ext === '.gif') contentType = 'image/gif';

        return new Response(fileBuffer, {
            status: 200,
            headers: { 'Content-Type': contentType },
        });
    } catch (err) {
        console.log(err);
        return NextResponse.json({ message: 'Arquivo não encontrado.', err }, { status: 404 });
    }
}
