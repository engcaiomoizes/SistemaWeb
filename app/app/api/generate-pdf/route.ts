import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";
import { spawn, ChildProcess } from "child_process";
import path from "path";
import fs from "fs";
import { PDFDocument } from "pdf-lib";

let xvfbProcess: ChildProcess | null = null;

export async function POST(req: NextRequest) {
    try {
        const { html, title } = await req.json();

        if (!xvfbProcess) {
            xvfbProcess = spawn('Xvfb', [':99', '-screen', '0', '1280x720x24']);

            xvfbProcess.stderr?.on('data', (data) => {
                console.error(`Xvfb stderr: ${data}`);
            });

            xvfbProcess.on('close', (code) => {
                console.log(`Xvfb process exited with code ${code}`);
                xvfbProcess = null;
            });

            await new Promise(resolve => setTimeout(resolve, 500));
        }

        /** BUSCA DINÂMICA PELO ARQUIVO CSS DO TAILWIND */
        const cssDir = path.join(process.cwd(), '.next/static/css');
        const files = fs.readdirSync(cssDir);
        const tailwindFile = files.find(file => file.endsWith('.css'));

        if (!tailwindFile) {
            throw new Error('Arquivo CSS do Tailwind não encontrado.');
        }
        /** */

        // const tailwindCSSPath = path.join(process.cwd(), '/.next/static/chunks/[root of the server]__9d1267._.css');
        const tailwindCSSPath = path.join(cssDir, tailwindFile);
        const tailwindCSS = fs.readFileSync(tailwindCSSPath, 'utf8');

        const pages = html.split('<div class="page-break"></div>');
        const numPages = pages.length;

        const puppeteerOptions = {
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
            ],
            executablePath: '/usr/bin/chromium',
            env: { DISPLAY: ':99' },
        };

        const browser = await puppeteer.launch(puppeteerOptions);

        const pdfBuffers: Buffer[] = [];
        for (let i = 0; i < numPages; i++) {
            const pageContent = pages[i];

            const styledHTML = `
                <!DOCTYPE html>
                <html>
                    <head>
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Página ${i + 1} de ${numPages}</title>
                        <style>
                            ${tailwindCSS}
                        </style>
                    </head>
                    <body>
                        ${html}
                    </body>
                </html>
            `;

            const page = await browser.newPage();
            await page.setContent(styledHTML);
            const pdfBuffer: Uint8Array = await page.pdf({ format: "A4", margin: { top: 0, bottom: 0 } });
            pdfBuffers.push(Buffer.from(pdfBuffer));
            await page.close();
        }

        await browser.close();

        const combinedPdf = await PDFDocument.create();
        combinedPdf.setTitle("Folha");
        for (const pdfBuffer of pdfBuffers) {
            const pdfDoc = await PDFDocument.load(pdfBuffer);
            const copiedPages = await combinedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
            copiedPages.forEach((page) => {
                combinedPdf.addPage(page);
            });
        }

        const combinedPdfBuffer = await combinedPdf.save();

        const headers = {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=documento.pdf',
        };

        return new NextResponse(combinedPdfBuffer, {
            status: 200,
            headers: headers,
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: 'Erro ao gerar PDF.', err }, { status: 500 });
    }
}
