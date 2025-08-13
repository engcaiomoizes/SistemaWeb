import bcrypt from 'bcrypt';

interface GenerateSessionDTO {
    login: string;
    senhaHash: string;
}

export function GenerateSession({
    login,
    senhaHash,
}: GenerateSessionDTO): string {
    const secret = process.env.SESISON_SECRET;

    const plainToken = `${secret}+${login}+${senhaHash}+${new Date().getTime()}`;

    const hash = bcrypt.hashSync(plainToken, 12);

    return hash;
}