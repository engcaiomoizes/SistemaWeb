// export interface IDBSettings {
//     host: string
//     port: number
//     user: string
//     password: string
//     database: string
// }

// export const GetDBSettings = (): IDBSettings => {
//     return {
//         host: process.env.DATABASE_HOST!,
//         port: parseInt(process.env.DATABASE_PORT!),
//         user: process.env.DATABASE_USER!,
//         password: process.env.DATABASE_PASS!,
//         database: process.env.DATABASE_DB!
//     }
// }

import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
    return new PrismaClient();
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClientSingleton | undefined;
};

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;