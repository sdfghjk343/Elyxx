"use client"

import type React from "react"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const dynamic = "force-dynamic"

export default function SettingsPage() {
  const { data: session } = useSession()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)

  // Dati utente simulati per la demo
  const mockUser = {
    id: "1",
    name: "Utente",
    email: "utente@esempio.it",
    plan: "free",
    usage: {
      messagesUsed: 15,
      messagesLimit: 20,
      imagesGenerated: 0,
      imagesLimit: 0,
      filesUploaded: 0,
      filesLimit: 0,
    },
  }

  // Combina i dati della sessione con i dati simulati
  const userWithUsage = {
    ...session?.user,
    name: session?.user?.name || mockUser.name,
    email: session?.user?.email || mockUser.email,
    plan: session?.user?.plan || mockUser.plan,
    usage: mockUser.usage,
  }

  const [name, setName] = useState(userWithUsage.name || "")
  const [email, setEmail] = useState(userWithUsage.email || "")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSuccess(null)

    // Simuliamo un aggiornamento
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setSuccess("Profilo aggiornato con successo")
    setIsSubmitting(false)
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Impostazioni" text="Gestisci il tuo account e le preferenze." user={userWithUsage} />

      <Tabs defaultValue="profile" className="mt-6">
        <TabsList>
          <TabsTrigger value="profile">Profilo</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifiche</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Profilo</CardTitle>
              <CardDescription>Aggiorna le informazioni del tuo profilo.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                {success && <div className="bg-green-50 text-green-800 p-3 rounded-md text-sm">{success}</div>}

                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
              </CardContent>

              <CardFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Salvataggio..." : "Salva modifiche"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>Gestisci le impostazioni del tuo account.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Le impostazioni dell'account saranno disponibili a breve.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Notifiche</CardTitle>
              <CardDescription>Configura le tue preferenze di notifica.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Le impostazioni delle notifiche saranno disponibili a breve.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}

