import { NextAuthOptions, User } from 'next-auth'
import CredentialProvider from 'next-auth/providers/credentials'
import prisma from '@/lib/db';
import bcrypt from 'bcrypt';

interface Credentials {
    login?: string;
    senha?: string;
}

// Aumentar o tipo Session para incluir suas propriedades personalizadas
declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            nome: string;
            login: string;
            email?: string | null | undefined;
            cargo?: string | null | undefined;
            nivel: string;
            cadastrar_locais: boolean;
            cadastrar_tipos: boolean;
            cadastrar_patrimonios: boolean;
            cadastrar_usuarios: boolean;
            cadastrar_niveis: boolean;
            cadastrar_ramais: boolean;
            cadastrar_updates: boolean;
            cadastrar_funcionarios: boolean;
            cadastrar_feriados: boolean;
            cadastrar_impressoras: boolean;
        }
        expires: string;
    }

    interface User {
        id: string;
        nome: string;
        login: string;
        email?: string | null | undefined; // Email é opcional no tipo User
        cargo?: string | null | undefined;
        nivel: string;
        cadastrar_locais: boolean;
        cadastrar_tipos: boolean;
        cadastrar_patrimonios: boolean;
        cadastrar_usuarios: boolean;
        cadastrar_niveis: boolean;
        cadastrar_ramais: boolean;
        cadastrar_updates: boolean;
        cadastrar_funcionarios: boolean;
        cadastrar_feriados: boolean;
        cadastrar_impressoras: boolean;
    }
}

// Aumentar o tipo JWT para incluir suas propriedades personalizadas
declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        nome: string;
        login: string;
        email?: string | null | undefined;
        cargo?: string | null | undefined;
        nivel: string;
        cadastrar_locais: boolean;
        cadastrar_tipos: boolean;
        cadastrar_patrimonios: boolean;
        cadastrar_usuarios: boolean;
        cadastrar_niveis: boolean;
        cadastrar_ramais: boolean;
        cadastrar_updates: boolean;
        cadastrar_funcionarios: boolean;
        cadastrar_feriados: boolean;
        cadastrar_impressoras: boolean;
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialProvider({
            name: 'Credentials',
            credentials: {
                login: { label: 'Login', type: 'text' },
                senha: { label: 'Senha', type: 'password' }
            },
            async authorize(credentials?: Credentials) {
                if (!credentials) {
                    console.log("Credentials are undefined.");
                    return null;
                }

                const { login, senha } = credentials;

                if (!login || !senha) {
                    console.log("Login ou senha ausentes.");
                    return null;
                }

                try {
                    const userFromDb = await prisma.usuarios.findUnique({
                        where: {
                            login: login,
                        },
                        include: {
                            nivel_fk: true,
                        },
                    });

                    if (!userFromDb?.senha) {
                        console.log("Senha do usuário não encontrada.");
                        return null;
                    }

                    const isValidPassword = await bcrypt.compare(senha, userFromDb.senha);

                    if (!isValidPassword) {
                        console.log("Senha inválida.");
                        return null;
                    }

                    // Construir o objeto de usuário
                    const userForSession: User = {
                        id: userFromDb.id.toString(),
                        nome: userFromDb.nome,
                        login: userFromDb.login,
                        email: userFromDb.email,
                        cargo: userFromDb.cargo,
                        nivel: userFromDb.nivel_fk!.nome,
                        cadastrar_locais: userFromDb.nivel_fk!.cadastrar_locais,
                        cadastrar_tipos: userFromDb.nivel_fk!.cadastrar_tipos,
                        cadastrar_patrimonios: userFromDb.nivel_fk!.cadastrar_patrimonios,
                        cadastrar_usuarios: userFromDb.nivel_fk!.cadastrar_usuarios,
                        cadastrar_niveis: userFromDb.nivel_fk!.cadastrar_niveis,
                        cadastrar_ramais: userFromDb.nivel_fk!.cadastrar_ramais,
                        cadastrar_updates: userFromDb.nivel_fk!.cadastrar_updates,
                        cadastrar_funcionarios: userFromDb.nivel_fk!.cadastrar_funcionarios,
                        cadastrar_feriados: userFromDb.nivel_fk!.cadastrar_feriados,
                        cadastrar_impressoras: userFromDb.nivel_fk!.cadastrar_impressoras,
                    };

                    return userForSession;

                } catch (error) {
                    console.error("Erro durante a autenticação:", error);
                    return null;
                }
            },
        })
    ],
    callbacks: {
        jwt: async ({ token, user, trigger, session }) => {
            if (user) {
                const customUser = user as any;

                return {
                    ...token,
                    id: customUser.id,
                    nome: customUser.nome,
                    login: customUser.login,
                    email: customUser.email,
                    cargo: customUser.cargo,
                    nivel: customUser.nivel,
                    cadastrar_locais: customUser.cadastrar_locais,
                    cadastrar_tipos: customUser.cadastrar_tipos,
                    cadastrar_patrimonios: customUser.cadastrar_patrimonios,
                    cadastrar_usuarios: customUser.cadastrar_usuarios,
                    cadastrar_niveis: customUser.cadastrar_niveis,
                    cadastrar_ramais: customUser.cadastrar_ramais,
                    cadastrar_updates: customUser.cadastrar_updates,
                    cadastrar_funcionarios: customUser.cadastrar_funcionarios,
                    cadastrar_feriados: customUser.cadastrar_feriados,
                    cadastrar_impressoras: customUser.cadastrar_impressoras,
                };
            }

            if (trigger === 'update') {
                try {
                    const userFromDb = await prisma.usuarios.findUnique({
                        where: {
                            id: token.id,
                        },
                        include: {
                            nivel_fk: true,
                        },
                    });

                    if (userFromDb) {
                        // Atualize o token com os dados mais recentes
                        token.nome = userFromDb.nome;
                        token.login = userFromDb.login;
                        token.email = userFromDb.email;
                        token.cargo = userFromDb.cargo;
                        token.nivel = userFromDb.nivel_fk!.nome;
                        token.cadastrar_locais = userFromDb.nivel_fk!.cadastrar_locais;
                        token.cadastrar_tipos = userFromDb.nivel_fk!.cadastrar_tipos;
                        token.cadastrar_patrimonios = userFromDb.nivel_fk!.cadastrar_patrimonios;
                        token.cadastrar_usuarios = userFromDb.nivel_fk!.cadastrar_usuarios;
                        token.cadastrar_niveis = userFromDb.nivel_fk!.cadastrar_niveis;
                        token.cadastrar_ramais = userFromDb.nivel_fk!.cadastrar_ramais;
                        token.cadastrar_updates = userFromDb.nivel_fk!.cadastrar_updates;
                        token.cadastrar_funcionarios = userFromDb.nivel_fk!.cadastrar_funcionarios;
                        token.cadastrar_feriados = userFromDb.nivel_fk!.cadastrar_feriados;
                        token.cadastrar_impressoras = userFromDb.nivel_fk!.cadastrar_impressoras;
                    }
                } catch (err) {
                    console.error('Erro ao atualizar o token: ', err);
                }
            }

            return token;
        },
        session: async ({ session, token }) => {
            session.user.id = token.id as string;
            session.user.nome = token.nome as string;
            session.user.login = token.login as string;
            session.user.email = token.email as string;
            session.user.cargo = token.cargo as string;
            session.user.nivel = token.nivel as string;
            session.user.cadastrar_locais = token.cadastrar_locais as boolean;
            session.user.cadastrar_tipos = token.cadastrar_tipos as boolean;
            session.user.cadastrar_patrimonios = token.cadastrar_patrimonios as boolean;
            session.user.cadastrar_usuarios = token.cadastrar_usuarios as boolean;
            session.user.cadastrar_niveis = token.cadastrar_niveis as boolean;
            session.user.cadastrar_ramais = token.cadastrar_ramais as boolean;
            session.user.cadastrar_updates = token.cadastrar_updates as boolean;
            session.user.cadastrar_funcionarios = token.cadastrar_funcionarios as boolean;
            session.user.cadastrar_feriados = token.cadastrar_feriados as boolean;
            session.user.cadastrar_impressoras = token.cadastrar_impressoras as boolean;

            return session;
        }
    },
    pages: {
        signIn: '/login'
    }
}