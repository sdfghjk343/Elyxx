import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { isAdmin } from "@/lib/utils"
import { Prisma } from "@prisma/client"

export async function GET(req: NextRequest) {
try {
  // Verifica l'autenticazione dell'utente
  const session = await getServerSession(authOptions)

  if (!session || !session.user || !isAdmin(session.user)) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 })
  }

  // Ottieni i parametri di paginazione dalla query
  const { searchParams } = new URL(req.url)
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "10")
  const search = searchParams.get("search") || ""

  // Calcola l'offset per la paginazione
  const skip = (page - 1) * limit

  // Costruisci la query di ricerca
  let where = {}
  
  if (search) {
    where = {
      OR: [
        { name: { contains: search } },
        { email: { contains: search } }
      ]
    }
  }

  // Ottieni gli utenti dal database
  const users = await db.user.findMany({
    where: where as Prisma.UserWhereInput,
    include: {
      subscription: true,
    },
    skip,
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
  })

  // Ottieni il conteggio totale degli utenti
  const total = await db.user.count({ where: where as Prisma.UserWhereInput })

  // Restituisci gli utenti
  return NextResponse.json({
    users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  })
} catch (error) {
  console.error("Errore nel recupero degli utenti:", error)
  return NextResponse.json({ error: "Si è verificato un errore durante il recupero degli utenti" }, { status: 500 })
}
}

export async function PUT(req: NextRequest) {
try {
  // Verifica l'autenticazione dell'utente
  const session = await getServerSession(authOptions)

  if (!session || !session.user || !isAdmin(session.user)) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 })
  }

  const { userId, data } = await req.json()

  if (!userId) {
    return NextResponse.json({ error: "ID utente mancante" }, { status: 400 })
  }

  // Aggiorna l'utente nel database
  const updatedUser = await db.user.update({
    where: { id: userId },
    data,
    include: {
      subscription: true,
    },
  })

  // Restituisci l'utente aggiornato
  return NextResponse.json(updatedUser)
} catch (error) {
  console.error("Errore nell'aggiornamento dell'utente:", error)
  return NextResponse.json(
    { error: "Si è verificato un errore durante l'aggiornamento dell'utente" },
    { status: 500 },
  )
}
}