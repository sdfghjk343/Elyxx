import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { handleSubscriptionEvent } from "@/lib/subscription"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

// Questa è la chiave segreta per verificare che le richieste provengano da Stripe
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const signature = req.headers.get("stripe-signature")!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error("Errore nella verifica della firma webhook:", err)
      return NextResponse.json({ error: "Firma webhook non valida" }, { status: 400 })
    }

    // Gestisci gli eventi di Stripe
    switch (event.type) {
      case "checkout.session.completed":
        await handleSubscriptionEvent(event)
        break
      case "invoice.payment_succeeded":
        await handleSubscriptionEvent(event)
        break
      case "customer.subscription.deleted":
        await handleSubscriptionEvent(event)
        break
      default:
        console.log(`Evento non gestito: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Errore nella gestione del webhook:", error)
    return NextResponse.json({ error: "Errore interno del server" }, { status: 500 })
  }
}

