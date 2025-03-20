import type { DefaultSession, DefaultUser } from "next-auth"
import type { DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string
      plan: string
      subscription?: any
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    id: string
    role: string
    plan: string
    subscription?: any
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string
    role: string
    plan: string
    subscription?: any
  }
}

