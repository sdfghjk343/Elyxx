import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  console.log(`Middleware eseguito per il percorso: ${pathname}`)

  // Proteggi le rotte della dashboard
  if (pathname.startsWith("/dashboard")) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    })

    console.log(`Token per ${pathname}:`, token ? "presente" : "assente")

    // Reindirizza al login se non autenticato
    if (!token) {
      console.log(`Reindirizzamento a /login da ${pathname} (non autenticato)`)
      const url = new URL("/login", request.url)
      url.searchParams.set("callbackUrl", encodeURI(pathname))
      return NextResponse.redirect(url)
    }

    // Proteggi le rotte admin
    if (pathname.startsWith("/dashboard/admin") && token.role !== "admin") {
      console.log(`Reindirizzamento a /dashboard da ${pathname} (non admin)`)
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  // Reindirizza gli utenti autenticati dalla pagina di login alla dashboard
  if (pathname === "/login" || pathname === "/register") {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    })

    console.log(`Token per ${pathname}:`, token ? "presente" : "assente")

    if (token) {
      console.log(`Reindirizzamento a /dashboard da ${pathname} (già autenticato)`)
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  console.log(`Middleware: continua navigazione normale per ${pathname}`)
  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register", "/admin-login"],
}

