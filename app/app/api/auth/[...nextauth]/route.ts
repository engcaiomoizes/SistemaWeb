import NextAuth from 'next-auth/next'
// import { NextAuthOptions } from 'next-auth'
// import CredentialProvider from 'next-auth/providers/credentials'
// import prisma from '@/lib/db';
// import bcrypt from 'bcrypt';
import { authOptions } from '@/lib/authOptions';

// interface Credentials {
//     login?: string;
//     senha?: string;
// }

// export const authOptions: NextAuthOptions = {
//     providers: [
//         CredentialProvider({
//             name: 'Credentials',
//             credentials: {
//                 login: { label: 'Login', type: 'text' },
//                 senha: { label: 'Senha', type: 'password' }
//             },
//             async authorize(credentials?: Credentials) {
//                 if (!credentials) {
//                     console.log("Credentials are undefined.");
//                     return null;
//                 }

//                 const { login, senha } = credentials;

//                 if (!login || !senha)
//                     return null;

//                 const user = await prisma.usuarios.findUnique({
//                     where: {
//                         login: login,
//                     },
//                     include: {
//                         nivel_fk: true,
//                     },
//                 });

//                 if (!user?.senha)
//                     return null;

//                 const isValidPassword = await bcrypt.compare(senha, user.senha);

//                 if (!isValidPassword)
//                     return null;

//                 return user;
//             },
//         })
//     ],
//     callbacks: {
//         jwt: async ({ token, user }) => {
//             const customUser = user as any;

//             if (user) {
//                 return {
//                     ...token,
//                     id: customUser.id,
//                     nome: customUser.nome,
//                     nivel: customUser.nivel_fk.nome,
//                     cadastrar_locais: customUser.nivel_fk.cadastrar_locais,
//                     cadastrar_tipos: customUser.nivel_fk.cadastrar_tipos,
//                     cadastrar_patrimonios: customUser.nivel_fk.cadastrar_patrimonios,
//                     cadastrar_usuarios: customUser.nivel_fk.cadastrar_usuarios,
//                     cadastrar_niveis: customUser.nivel_fk.cadastrar_niveis,
//                     cadastrar_ramais: customUser.nivel_fk.cadastrar_ramais,
//                 }
//             }

//             return token;
//         },
//         session: async ({ session, token }) => {
//             return {
//                 ...session,
//                 user: {
//                     nome: token.nome,
//                     nivel: token.nivel,
//                     cadastrar_locais: token.cadastrar_locais,
//                     cadastrar_tipos: token.cadastrar_tipos,
//                     cadastrar_patrimonios: token.cadastrar_patrimonios,
//                     cadastrar_usuarios: token.cadastrar_usuarios,
//                     cadastrar_niveis: token.cadastrar_niveis,
//                     cadastrar_ramais: token.cadastrar_ramais,
//                     id: token.id
//                 }
//             }
//         }
//     },
//     pages: {
//         signIn: '/login'
//     }
// }

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }