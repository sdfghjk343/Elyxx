import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string
      subscription?: any
    } & DefaultSession["user"]
  }

  // Estendi anche il tipo User
  interface User {
    role?: string
    subscription?: any
  }
}

// Estendi anche il tipo JWT
declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role?: string
    subscription?: any
  }
}