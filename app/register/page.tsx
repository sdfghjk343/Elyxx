"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle } from "lucide-react"

export default function RegisterPage() {
  const searchParams = useSearchParams()
  const planParam = searchParams.get("plan")

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          plan: planParam || "free",
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Errore durante la registrazione")
      }

      setIsSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Si è verificato un errore durante la registrazione")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Determina il piano selezionato
  let selectedPlan = "Free"
  if (planParam === "pro") selectedPlan = "Pro"
  if (planParam === "business") selectedPlan = "Business"

  if (isSuccess) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-center text-2xl">Registrazione Completata!</CardTitle>
            <CardDescription className="text-center">
              Ti abbiamo inviato un'email di conferma a <strong>{email}</strong>. Per favore, controlla la tua casella
              di posta e clicca sul link di conferma.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button asChild>
              <Link href="/login">Vai al Login</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Crea il tuo account</CardTitle>
          <CardDescription>
            {planParam
              ? `Stai per registrarti con il piano ${selectedPlan}`
              : "Registrati per iniziare a usare la nostra AI"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome completo</Label>
              <Input
                id="name"
                placeholder="Mario Rossi"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nome@esempio.it"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {planParam && (
              <div className="bg-muted p-4 rounded-lg">
                <p className="font-medium">Piano selezionato: {selectedPlan}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {planParam === "pro" && "Accesso illimitato a tutte le funzionalità principali"}
                  {planParam === "business" && "Accesso completo a tutte le funzionalità avanzate"}
                </p>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Registrazione in corso..." : "Registrati"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Hai già un account?{" "}
            <Link href="/login" className="text-primary underline underline-offset-4">
              Accedi
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

