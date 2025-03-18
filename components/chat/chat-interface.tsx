"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Paperclip, AlertCircle } from "lucide-react"
import { ChatMessage } from "@/components/chat/chat-message"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface ChatInterfaceProps {
  user: {
    plan: string
    usage: {
      messagesUsed: number
      messagesLimit: number
    }
  }
}

type Message = {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: Date
}

export function ChatInterface({ user }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "system",
      content: "Benvenuto! Come posso aiutarti oggi?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Funzione per generare un ID univoco
  const generateId = () => Math.random().toString(36).substring(2, 11)

  // Scroll automatico verso il basso quando arrivano nuovi messaggi
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim()) return

    // Verifica se l'utente ha raggiunto il limite di messaggi (solo per piano Free)
    if (user.plan === "free" && user.usage.messagesUsed >= user.usage.messagesLimit) {
      setError("Hai raggiunto il limite giornaliero di messaggi. Aggiorna il tuo piano per continuare.")
      return
    }

    // Aggiungi il messaggio dell'utente
    const userMessage: Message = {
      id: generateId(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    setError(null)

    try {
      // Simuliamo una risposta dell'AI
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // In un'implementazione reale, qui chiameremmo l'API dell'AI
      // const response = await fetch('/api/chat', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ message: input, history: messages }),
      // });

      // if (!response.ok) throw new Error('Errore nella generazione della risposta');
      // const data = await response.json();

      // Risposta simulata dell'AI
      const aiResponses = [
        "Capisco la tua domanda. Posso aiutarti con questo.",
        "Interessante punto di vista. Ecco cosa penso al riguardo...",
        "Grazie per la tua domanda. Ecco alcune informazioni utili.",
        "Sto analizzando la tua richiesta. Ecco i risultati.",
        "Questa è una domanda complessa. Permettimi di spiegare in dettaglio.",
      ]

      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)]

      const assistantMessage: Message = {
        id: generateId(),
        role: "assistant",
        content: `${randomResponse} ${input.length > 20 ? input.substring(0, 20) + "..." : input} è un argomento interessante. Posso fornirti ulteriori dettagli se necessario.`,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])

      // Aggiorna il contatore di utilizzo (solo per piano Free)
      if (user.plan === "free") {
        user.usage.messagesUsed += 1
      }
    } catch (err) {
      setError("Si è verificato un errore durante l'elaborazione della tua richiesta.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const isLimitReached = user.plan === "free" && user.usage.messagesUsed >= user.usage.messagesLimit

  return (
    <Card className="flex flex-col h-[600px] border shadow-sm">
      <div className="flex-grow overflow-hidden relative">
        <ScrollArea className="h-full p-4">
          <div className="space-y-4 pb-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="flex items-center space-x-2 p-4 rounded-lg bg-muted w-3/4">
                <div className="flex space-x-2">
                  <div
                    className="w-2 h-2 rounded-full bg-primary animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full bg-primary animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full bg-primary animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
                <span className="text-sm text-muted-foreground">L'AI sta scrivendo...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      {error && (
        <Alert variant="destructive" className="mx-4 mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Errore</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isLimitReached && (
        <Alert className="mx-4 mb-4 bg-yellow-50 border-yellow-200 text-yellow-800">
          <AlertCircle className="h-4 w-4 text-yellow-800" />
          <AlertTitle>Limite Raggiunto</AlertTitle>
          <AlertDescription>
            Hai raggiunto il limite giornaliero di messaggi.{" "}
            <Button variant="link" className="h-auto p-0 text-yellow-800 underline" asChild>
              <a href="/dashboard/upgrade">Aggiorna il tuo piano</a>
            </Button>{" "}
            per continuare.
          </AlertDescription>
        </Alert>
      )}

      <div className="p-4 border-t">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          {user.plan !== "free" && (
            <Button type="button" size="icon" variant="ghost" disabled={isLoading || isLimitReached}>
              <Paperclip className="h-4 w-4" />
              <span className="sr-only">Allega file</span>
            </Button>
          )}
          <Input
            placeholder="Scrivi un messaggio..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading || isLimitReached}
            className="flex-grow"
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim() || isLimitReached}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Invia</span>
          </Button>
        </form>
        {user.plan === "free" && (
          <p className="text-xs text-muted-foreground mt-2">
            {user.usage.messagesUsed}/{user.usage.messagesLimit} messaggi utilizzati oggi
          </p>
        )}
      </div>
    </Card>
  )
}

