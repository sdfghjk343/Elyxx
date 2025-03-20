"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { ChatInterface } from "@/components/chat/chat-interface"
import { SubscriptionBanner } from "@/components/dashboard/subscription-banner"
import { UsageStats } from "@/components/dashboard/usage-stats"

export const dynamic = "force-dynamic"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(true)

  // Simuliamo un utente autenticato se necessario
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

  const [user, setUser] = useState(mockUser)

  useEffect(() => {
    if (status === "loading") return

    if (status === "authenticated" && session?.user) {
      console.log("Utente autenticato:", session.user)
      // Qui potresti caricare i dati reali dell'utente
    }

    setIsLoading(false)
  }, [session, status])

  if (isLoading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </DashboardShell>
    )
  }

  // Usa i dati dell'utente dalla sessione se disponibili
  const userData = session?.user || user
  const userWithUsage = {
    ...userData,
    name: userData.name || mockUser.name,
    email: userData.email || mockUser.email,
    plan: userData.plan || mockUser.plan,
    usage: user.usage, // Manteniamo i dati di utilizzo simulati per ora
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Dashboard" text="Benvenuto nella tua dashboard personale." user={userWithUsage} />

      {userWithUsage.plan === "free" && <SubscriptionBanner />}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messaggi Rimanenti</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userWithUsage.plan === "free"
                ? `${userWithUsage.usage.messagesLimit - userWithUsage.usage.messagesUsed}/${userWithUsage.usage.messagesLimit}`
                : "Illimitati"}
            </div>
            <p className="text-xs text-muted-foreground">
              {userWithUsage.plan === "free"
                ? "Limite giornaliero"
                : "Piano " + userWithUsage.plan.charAt(0).toUpperCase() + userWithUsage.plan.slice(1)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Generazione Immagini</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userWithUsage.plan === "free"
                ? "Non disponibile"
                : userWithUsage.plan === "pro"
                  ? `${userWithUsage.usage.imagesGenerated}/10`
                  : "Illimitata"}
            </div>
            <p className="text-xs text-muted-foreground">
              {userWithUsage.plan === "free"
                ? "Aggiorna per sbloccare"
                : userWithUsage.plan === "pro"
                  ? "Limite mensile"
                  : "Piano Business"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Caricamento File</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userWithUsage.plan === "free"
                ? "Non disponibile"
                : userWithUsage.plan === "pro"
                  ? "10MB max"
                  : "100MB max"}
            </div>
            <p className="text-xs text-muted-foreground">
              {userWithUsage.plan === "free"
                ? "Aggiorna per sbloccare"
                : `Piano ${userWithUsage.plan.charAt(0).toUpperCase() + userWithUsage.plan.slice(1)}`}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stato Abbonamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userWithUsage.plan === "free" ? "Free" : userWithUsage.plan === "pro" ? "Pro" : "Business"}
            </div>
            <p className="text-xs text-muted-foreground">
              {userWithUsage.plan === "free" ? "Funzionalità limitate" : "Abbonamento attivo"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="chat" className="mt-6">
        <TabsList>
          <TabsTrigger value="chat">Chat AI</TabsTrigger>
          <TabsTrigger value="usage">Utilizzo</TabsTrigger>
          {(userWithUsage.plan === "pro" || userWithUsage.plan === "business") && (
            <TabsTrigger value="images">Generazione Immagini</TabsTrigger>
          )}
          {userWithUsage.plan === "business" && <TabsTrigger value="api">API</TabsTrigger>}
        </TabsList>
        <TabsContent value="chat" className="mt-6">
          <ChatInterface user={userWithUsage} />
        </TabsContent>
        <TabsContent value="usage" className="mt-6">
          <UsageStats user={userWithUsage} />
        </TabsContent>
        {(userWithUsage.plan === "pro" || userWithUsage.plan === "business") && (
          <TabsContent value="images" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Generazione Immagini</CardTitle>
                <CardDescription>Crea immagini uniche utilizzando l'intelligenza artificiale.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">Questa funzionalità sarà disponibile a breve.</p>
                  <Button disabled>Genera Immagine</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
        {userWithUsage.plan === "business" && (
          <TabsContent value="api" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>API Access</CardTitle>
                <CardDescription>Integra la nostra AI direttamente nelle tue applicazioni.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">Questa funzionalità sarà disponibile a breve.</p>
                  <Button disabled>Genera API Key</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </DashboardShell>
  )
}

