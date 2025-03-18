import { PrismaClient } from "@prisma/client"

declare global {
  var prisma: PrismaClient | undefined
}

// Previene la creazione di multiple istanze di PrismaClient durante lo sviluppo
export const db =
  globalThis.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  })

if (process.env.NODE_ENV !== "production") globalThis.prisma = db

