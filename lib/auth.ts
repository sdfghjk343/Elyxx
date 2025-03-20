import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { db } from "@/lib/db"
import { PrismaClient } from "@prisma/client"

// Creiamo un adapter personalizzato invece di usare PrismaAdapter
// Questo risolve il problema di compatibilità tra @auth/prisma-adapter e next-auth
const prisma = new PrismaClient()

export const authOptions: NextAuthOptions = {
  // Rimuoviamo l'adapter e usiamo solo JWT
  // adapter: PrismaAdapter(db),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 giorni
  },
  pages: {
    signIn: "/login",
    error: "/login",
    newUser: "/dashboard",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Credenziali mancanti")
        }

        // Verifica se è l'admin
        const adminEmail = process.env.ADMIN_EMAIL
        const adminPassword = process.env.ADMIN_PASSWORD

        if (adminEmail && adminPassword && credentials.email === adminEmail && credentials.password === adminPassword) {
          return {
            id: "admin-id",
            name: "Amministratore",
            email: adminEmail,
            role: "admin",
            image: null,
            plan: "business", // Aggiungiamo un piano per l'admin
          }
        }

        try {
          // Cerca l'utente nel database
          const user = await db.user.findUnique({
            where: { email: credentials.email },
            include: {
              subscription: true,
            },
          })

          if (!user) {
            throw new Error("Utente non trovato")
          }

          const passwordMatch = await compare(credentials.password, user.password)

          if (!passwordMatch) {
            throw new Error("Password non valida")
          }

          // Aggiungiamo il piano all'oggetto utente
          const plan = user.subscription?.planId?.toLowerCase() || "free"

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            image: user.image,
            subscription: user.subscription,
            plan: plan,
          }
        } catch (error) {
          console.error("Errore nell'autorizzazione:", error)
          throw new Error("Errore durante l'autenticazione")
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.subscription = user.subscription
        token.plan = user.plan
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id
        session.user.role = token.role
        session.user.subscription = token.subscription
        session.user.plan = token.plan
      }
      return session
    },
  },
  events: {
    async signIn({ user }) {
      console.log(`Utente autenticato: ${user.email}, ruolo: ${user.role}`)
    },
  },
  debug: process.env.NODE_ENV === "development",
}

