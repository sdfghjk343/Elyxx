import { type NextRequest, NextResponse } from "next/server"
import { hash } from "bcryptjs" // Cambiato da bcrypt a bcryptjs
import { db } from "@/lib/db"
import { sendVerificationEmail } from "@/lib/email"
import crypto from "crypto"

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, plan } = await req.json()

    // Validazione dei dati
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Tutti i campi sono obbligatori" }, { status: 400 })
    }

    // Verifica se l'email è già registrata
    try {
      const existingUser = await db.user.findUnique({
        where: { email },
      })

      if (existingUser) {
        return NextResponse.json({ error: "Email già registrata" }, { status: 400 })
      }
    } catch (error) {
      console.error("Errore nella verifica dell'email:", error)
      return NextResponse.json(
        {
          error: "Errore nella verifica dell'email",
          details: error instanceof Error ? error.message : String(error),
        },
        { status: 500 },
      )
    }

    try {
      // Cripta la password
      const hashedPassword = await hash(password, 10)

      // Genera un token di verifica
      const verificationToken = crypto.randomBytes(32).toString("hex")
      const tokenExpiry = new Date()
      tokenExpiry.setHours(tokenExpiry.getHours() + 24) // Scade dopo 24 ore

      // Crea un nuovo utente nel database
      const user = await db.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: "user",
          verificationToken,
          verificationTokenExpiry: tokenExpiry,
          subscription: {
            create: {
              planId: plan === "pro" || plan === "business" ? plan.toUpperCase() : "FREE",
              status: "pending",
            },
          },
        },
      })

      // Invia un'email di verifica
      await sendVerificationEmail(email, verificationToken)

      // Restituisci una risposta di successo
      return NextResponse.json({
        success: true,
        message: "Registrazione completata. Controlla la tua email per verificare il tuo account.",
      })
    } catch (error) {
      console.error("Errore nella creazione dell'utente:", error)
      return NextResponse.json(
        {
          error: "Errore nella creazione dell'utente",
          details: error instanceof Error ? error.message : String(error),
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Errore nella registrazione:", error)
    return NextResponse.json(
      {
        error: "Si è verificato un errore durante la registrazione",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

