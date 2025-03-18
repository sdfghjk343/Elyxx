import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { createCheckoutSession } from "@/lib/subscription"

export async function POST(req: NextRequest) {
  try {
    // Verifica l'autenticazione dell'utente
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 401 })
    }

    const { planId, billingCycle } = await req.json()

    if (!planId || !billingCycle) {
      return NextResponse.json({ error: "Piano e ciclo di fatturazione sono obbligatori" }, { status: 400 })
    }

    // Crea una sessione di checkout Stripe
    const checkoutSession = await createCheckoutSession(
      session.user.id,
      planId as "PRO" | "BUSINESS",
      billingCycle as "monthly" | "annually",
    )

    // Restituisci l'URL della sessione di checkout
    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error("Errore nella creazione della sessione di checkout:", error)
    return NextResponse.json(
      { error: "Si è verificato un errore durante la creazione della sessione di checkout" },
      { status: 500 },
    )
  }
}

