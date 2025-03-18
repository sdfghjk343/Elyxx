"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle } from "lucide-react"

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [isVerifying, setIsVerifying] = useState(true)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) {
      setIsVerifying(false)
      setError("Token di verifica mancante")
      return
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Errore durante la verifica dell'email")
        }

        setIsSuccess(true)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Si è verificato un errore durante la verifica dell'email")
      } finally {
        setIsVerifying(false)
      }
    }

    verifyEmail()
  }, [token, router])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Verifica Email</CardTitle>
          <CardDescription className="text-center">
            {isVerifying ? "Stiamo verificando il tuo indirizzo email..." : ""}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center">
          {isVerifying ? (
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          ) : isSuccess ? (
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Email Verificata!</h2>
              <p className="text-gray-500 dark:text-gray-400">
                Il tuo indirizzo email è stato verificato con successo. Ora puoi accedere al tuo account.
              </p>
            </div>
          ) : (
            <div className="text-center">
              <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Verifica Fallita</h2>
              <p className="text-gray-500 dark:text-gray-400">
                {error || "Non è stato possibile verificare il tuo indirizzo email."}
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          {!isVerifying && (
            <Button asChild>
              <Link href={isSuccess ? "/login" : "/"}>{isSuccess ? "Vai al Login" : "Torna alla Home"}</Link>
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

