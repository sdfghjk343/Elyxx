import { type NextRequest, NextResponse } from "next/server"
import { hash } from "bcrypt"
import { db } from "@/lib/db"

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json()

    if (!token || !password) {
      return NextResponse.json({ error: "Token e password sono obbligatori" }, { status: 400 })
    }

    // Trova l'utente con il token di reset
    const user = await db.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordTokenExpiry: {
          gt: new Date(),
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: "Token non valido o scaduto" }, { status: 400 })
    }

    // Cripta la nuova password
    const hashedPassword = await hash(password, 10)

    // Aggiorna la password dell'utente
    await db.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordTokenExpiry: null,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Errore nel reset della password:", error)
    return NextResponse.json({ error: "Si è verificato un errore durante il reset della password" }, { status: 500 })
  }
}

