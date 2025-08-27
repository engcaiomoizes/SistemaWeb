import { NextResponse } from 'next/server'
import { withAuth, NextRequestWithAuth, NextAuthMiddlewareOptions } from 'next-auth/middleware'

const middleware = (request: NextRequestWithAuth) => {

  const isMaintenance = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true';
  const isMaintenancePage = request.nextUrl.pathname === '/maintenance';

  if (isMaintenance && !isMaintenancePage) {
    const url = request.nextUrl.clone();
    url.pathname = '/maintenance';
    return NextResponse.rewrite(url);
  }

  const isPrivateRoutes = request.nextUrl.pathname.startsWith('/private')
  const isAdminUser = request.nextauth.token?.role === 'admin'

  if (isPrivateRoutes && !isAdminUser) {
    return NextResponse.rewrite(new URL('/denied', request.url))
  }

  if (request.nextUrl.pathname.startsWith('/usuarios')) {
    if (!request.nextauth.token?.cadastrar_usuarios)
      return NextResponse.rewrite(new URL('/denied', request.url));
  }
  if (request.nextUrl.pathname.startsWith('/locais')) {
    if (!request.nextauth.token?.cadastrar_locais)
      return NextResponse.rewrite(new URL('/denied', request.url));
  }
  if (request.nextUrl.pathname.startsWith('/niveis')) {
    if (!request.nextauth.token?.cadastrar_niveis)
      return NextResponse.rewrite(new URL('/denied', request.url));
  }
  if (request.nextUrl.pathname.startsWith('/patrimonios')) {
    if (!request.nextauth.token?.cadastrar_patrimonios)
      return NextResponse.rewrite(new URL('/denied', request.url));
  }
  if (request.nextUrl.pathname.startsWith('/tipos')) {
    if (!request.nextauth.token?.cadastrar_tipos)
      return NextResponse.rewrite(new URL('/denied', request.url));
  }
  if (request.nextUrl.pathname.startsWith('/ramais')) {
    if (!request.nextauth.token?.cadastrar_ramais)
      return NextResponse.rewrite(new URL('/denied', request.url));
  }
  if (request.nextUrl.pathname.startsWith('/updates')) {
    if (!request.nextauth.token?.cadastrar_updates)
      return NextResponse.rewrite(new URL('/denied', request.url));
  }
  if (request.nextUrl.pathname.startsWith('/funcionarios')) {
    if (!request.nextauth.token?.cadastrar_funcionarios)
      return NextResponse.rewrite(new URL('/denied', request.url));
  }
  if (request.nextUrl.pathname.startsWith('/feriados')) {
    if (!request.nextauth.token?.cadastrar_feriados)
      return NextResponse.rewrite(new URL('/denied', request.url));
  }
}

const callbackOptions: NextAuthMiddlewareOptions = {}

export default withAuth(middleware, callbackOptions)

export const config = {
  //matcher: '/contas'
  matcher: [
    '/((?!login|cadastrar|ramal|api/auth/[...nextauth]|api/cadastrar|static|_next/static|_next/image).*)'
  ],
}