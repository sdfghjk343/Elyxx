import Stripe from "stripe"
import { db } from "@/lib/db"

// Inizializza Stripe con la chiave segreta
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

// Definizione dei piani
export const PLANS = {
  FREE: {
    name: "Free",
    price: 0,
    messagesLimit: 20,
    imagesLimit: 0,
    fileUploadLimit: 0,
    stripeProductId: null,
    stripePriceId: {
      monthly: null,
      annually: null,
    },
  },
  PRO: {
    name: "Pro",
    price: {
      monthly: 999, // €9.99
      annually: 9990, // €99.90
    },
    messagesLimit: null, // illimitato
    imagesLimit: 10,
    fileUploadLimit: 10 * 1024 * 1024, // 10MB
    stripeProductId: process.env.STRIPE_PRO_PRODUCT_ID,
    stripePriceId: {
      monthly: process.env.STRIPE_PRO_PRICE_ID_MONTHLY,
      annually: process.env.STRIPE_PRO_PRICE_ID_ANNUALLY,
    },
  },
  BUSINESS: {
    name: "Business",
    price: {
      monthly: 2999, // €29.99
      annually: 29990, // €299.90
    },
    messagesLimit: null, // illimitato
    imagesLimit: null, // illimitato
    fileUploadLimit: 100 * 1024 * 1024, // 100MB
    stripeProductId: process.env.STRIPE_BUSINESS_PRODUCT_ID,
    stripePriceId: {
      monthly: process.env.STRIPE_BUSINESS_PRICE_ID_MONTHLY,
      annually: process.env.STRIPE_BUSINESS_PRICE_ID_ANNUALLY,
    },
  },
}

// Crea una sessione di checkout Stripe
export async function createCheckoutSession(
  userId: string,
  planId: "PRO" | "BUSINESS",
  billingCycle: "monthly" | "annually",
) {
  const plan = PLANS[planId]
  const stripePriceId = plan.stripePriceId[billingCycle]

  if (!stripePriceId) {
    throw new Error("Piano non valido o ciclo di fatturazione non valido")
  }

  // Ottieni l'utente dal database
  const user = await db.user.findUnique({
    where: { id: userId },
    include: { subscription: true },
  })

  if (!user) {
    throw new Error("Utente non trovato")
  }

  // Crea o aggiorna il cliente Stripe
  let stripeCustomerId = user.stripeCustomerId

  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name || undefined,
      metadata: {
        userId: user.id,
      },
    })
    stripeCustomerId = customer.id

    // Aggiorna l'utente con l'ID del cliente Stripe
    await db.user.update({
      where: { id: user.id },
      data: { stripeCustomerId },
    })
  }

  // Crea la sessione di checkout
  const session = await stripe.checkout.sessions.create({
    customer: stripeCustomerId,
    line_items: [
      {
        price: stripePriceId,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${process.env.NEXTAUTH_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXTAUTH_URL}/dashboard/upgrade?canceled=true`,
    metadata: {
      userId: user.id,
      planId,
      billingCycle,
    },
  })

  return session
}

// Gestisce il webhook di Stripe per gli eventi di abbonamento
export async function handleSubscriptionEvent(event: Stripe.Event) {
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session
    const { userId, planId, billingCycle } = session.metadata as {
      userId: string
      planId: "PRO" | "BUSINESS"
      billingCycle: "monthly" | "annually"
    }

    // Aggiorna l'abbonamento dell'utente nel database
    await db.subscription.upsert({
      where: { userId },
      update: {
        planId,
        billingCycle,
        stripeSubscriptionId: session.subscription as string,
        status: "active",
        currentPeriodEnd: new Date(Date.now() + (billingCycle === "monthly" ? 30 : 365) * 24 * 60 * 60 * 1000),
      },
      create: {
        userId,
        planId,
        billingCycle,
        stripeSubscriptionId: session.subscription as string,
        status: "active",
        currentPeriodEnd: new Date(Date.now() + (billingCycle === "monthly" ? 30 : 365) * 24 * 60 * 60 * 1000),
      },
    })
  }

  if (event.type === "invoice.payment_succeeded") {
    const invoice = event.data.object as Stripe.Invoice
    const subscriptionId = invoice.subscription as string

    // Ottieni l'abbonamento dal database
    const subscription = await db.subscription.findFirst({
      where: { stripeSubscriptionId: subscriptionId },
    })

    if (subscription) {
      // Aggiorna la data di fine del periodo corrente
      await db.subscription.update({
        where: { id: subscription.id },
        data: {
          status: "active",
          currentPeriodEnd: new Date(
            Date.now() + (subscription.billingCycle === "monthly" ? 30 : 365) * 24 * 60 * 60 * 1000,
          ),
        },
      })
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const stripeSubscription = event.data.object as Stripe.Subscription
    const subscriptionId = stripeSubscription.id

    // Ottieni l'abbonamento dal database
    const subscription = await db.subscription.findFirst({
      where: { stripeSubscriptionId: subscriptionId },
    })

    if (subscription) {
      // Aggiorna lo stato dell'abbonamento
      await db.subscription.update({
        where: { id: subscription.id },
        data: {
          status: "canceled",
          planId: "FREE",
        },
      })
    }
  }
}

