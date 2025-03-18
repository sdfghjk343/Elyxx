import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { sendWelcomeEmail } from "@/lib/email"

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json()

    if (!token) {
      return NextResponse.json({ error: "Token mancante" }, { status: 400 })
    }

    // Trova l'utente con il token di verifica
    const user = await db.user.findFirst({
      where: {
        verificationToken: token,
        verificationTokenExpiry: {
          gt: new Date(),
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: "Token non valido o scaduto" }, { status: 400 })
    }

    // Aggiorna l'utente come verificato
    await db.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        verificationToken: null,
        verificationTokenExpiry: null,
      },
    })

    // Invia email di benvenuto
    await sendWelcomeEmail(user.email, user.name || "")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Errore nella verifica dell'email:", error)
    return NextResponse.json({ error: "Si è verificato un errore durante la verifica dell'email" }, { status: 500 })
  }
}

