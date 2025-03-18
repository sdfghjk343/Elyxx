import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { isAdmin } from "@/lib/utils"

export async function GET(req: NextRequest) {
  try {
    // Verifica l'autenticazione dell'utente
    const session = await getServerSession(authOptions)

    if (!session || !session.user || !isAdmin(session.user)) {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 401 })
    }

    // Ottieni le statistiche dal database
    const totalUsers = await db.user.count()

    const totalSubscriptions = await db.subscription.count({
      where: {
        OR: [{ planId: "PRO" }, { planId: "BUSINESS" }],
        status: "active",
      },
    })

    const totalMessages = await db.message.count()

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const messagesLastDay = await db.message.count({
      where: {
        createdAt: {
          gte: today,
        },
      },
    })

    const lastMonth = new Date()
    lastMonth.setMonth(lastMonth.getMonth() - 1)

    const newUsersLastMonth = await db.user.count({
      where: {
        createdAt: {
          gte: lastMonth,
        },
      },
    })

    // Ottieni la distribuzione degli utenti per piano
    const usersByPlan = await db.subscription.groupBy({
      by: ["planId"],
      _count: {
        planId: true,
      },
    })

    // Formatta i dati per la risposta
    const planDistribution = usersByPlan.map((item) => ({
      plan: item.planId,
      count: item._count.planId,
    }))

    // Restituisci le statistiche
    return NextResponse.json({
      totalUsers,
      totalSubscriptions,
      totalMessages,
      messagesLastDay,
      newUsersLastMonth,
      planDistribution,
    })
  } catch (error) {
    console.error("Errore nel recupero delle statistiche:", error)
    return NextResponse.json(
      { error: "Si è verificato un errore durante il recupero delle statistiche" },
      { status: 500 },
    )
  }
}

