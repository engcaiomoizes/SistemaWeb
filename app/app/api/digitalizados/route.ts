import { exec } from "child_process";
import { NextResponse } from "next/server";
import path from "path";
import { promisify } from "util";

const execAsync = promisify(exec);

const NAPS2_CLI = path.join(process.cwd(), 'naps2/App/NAPS2.Console.exe');

export async function GET() {
    try {
        const command = `"${NAPS2_CLI}" --driver twain --listdevices`;
        const { stdout, stderr } = await execAsync(command);
        
        if (stderr) {
            return NextResponse.json({ message: 'Error', stderr }, { status: 400 });
        }

        return NextResponse.json({ message: 'OK', stdout }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ message: 'Error', err }, { status: 500 });
    }
}