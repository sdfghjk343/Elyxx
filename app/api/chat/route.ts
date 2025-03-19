import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { isAdmin, getSubscriptionPlan } from "@/lib/utils"

export async function POST(req: NextRequest) {
  try {
    const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY

    if (!MISTRAL_API_KEY) {
      return NextResponse.json({ error: "MISTRAL_API_KEY non configurata" }, { status: 500 })
    }

    // Verifica l'autenticazione dell'utente
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 401 })
    }

    const { message, history } = await req.json()

    // Ottieni il piano di abbonamento dell'utente
    const userPlan = getSubscriptionPlan(session.user)

    // Verifica se l'utente ha un piano Free e ha raggiunto il limite
    if (!isAdmin(session.user) && userPlan.name === "Free" && userPlan.messagesLimit !== null) {
      try {
        // Ottieni il conteggio dei messaggi dell'utente per oggi
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const messageCount = await db.message.count({
          where: {
            userId: session.user.id,
            createdAt: {
              gte: today,
            },
          },
        })

        if (messageCount >= userPlan.messagesLimit) {
          return NextResponse.json({ error: "Limite di messaggi giornaliero raggiunto" }, { status: 403 })
        }
      } catch (error) {
        console.error("Errore nel controllo del limite messaggi:", error)
        // Continuiamo comunque per non bloccare l'utente in caso di errore
      }
    }

    // Prepara i messaggi nel formato richiesto dall'API
    const messages = []
    
    // Aggiungi il messaggio di sistema
    messages.push({
      role: "system",
      content: "Sei un assistente AI utile, rispettoso e onesto. Rispondi sempre nel modo più utile possibile, mantenendo un tono amichevole."
    })
    
    // Aggiungi la cronologia dei messaggi
    if (history && history.length > 0) {
      for (const msg of history) {
        if (msg.role !== "system") {
          messages.push({
            role: msg.role,
            content: msg.content
          })
        }
      }
    }
    
    // Aggiungi il messaggio corrente dell'utente
    messages.push({
      role: "user",
      content: message
    })

    console.log("Invio richiesta a Mistral AI con messaggi:", JSON.stringify(messages))

    try {
      // Utilizziamo direttamente l'API REST di Mistral
      const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${MISTRAL_API_KEY}`
        },
        body: JSON.stringify({
          model: "mistral-small",
          messages: messages,
          max_tokens: 1000
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Errore API Mistral: ${JSON.stringify(errorData)}`);
      }
      
      const data = await response.json();
      const text = data.choices[0].message.content;

      // Salva il messaggio dell'utente e la risposta nel database
      if (!isAdmin(session.user)) {
        try {
          await db.message.create({
            data: {
              userId: session.user.id,
              content: message,
              role: "user",
            },
          })

          await db.message.create({
            data: {
              userId: session.user.id,
              content: text,
              role: "assistant",
            },
          })
        } catch (error) {
          console.error("Errore nel salvataggio dei messaggi:", error)
          // Continuiamo comunque per non bloccare la risposta all'utente
        }
      }

      return NextResponse.json({ content: text })
    } catch (error) {
      console.error("Errore nella generazione del testo:", error)
      return NextResponse.json(
        {
          error: "Errore nella generazione del testo",
          details: error instanceof Error ? error.message : String(error),
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Errore nella route chat:", error)
    return NextResponse.json(
      {
        error: "Impossibile elaborare la richiesta",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}