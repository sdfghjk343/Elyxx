import { type NextRequest, NextResponse } from "next/server"

// Simulazione di un database per tenere traccia dell'utilizzo
// In un'applicazione reale, useresti un database come MongoDB o PostgreSQL
let usageCounter = 0

export async function GET(req: NextRequest) {
  try {
    return NextResponse.json({
      totalRequests: usageCounter,
      limit: "Illimitato",
      status: "Attivo",
    })
  } catch (error) {
    console.error("Errore nel controllo dell'utilizzo:", error)
    return NextResponse.json({ error: "Impossibile recuperare i dati di utilizzo" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    // Incrementa il contatore di utilizzo
    usageCounter++

    return NextResponse.json({
      success: true,
      totalRequests: usageCounter,
    })
  } catch (error) {
    console.error("Errore nell'aggiornamento dell'utilizzo:", error)
    return NextResponse.json({ error: "Impossibile aggiornare i dati di utilizzo" }, { status: 500 })
  }
}

