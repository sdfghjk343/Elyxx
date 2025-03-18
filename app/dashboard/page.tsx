"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { ChatInterface } from "@/components/chat/chat-interface"
import { SubscriptionBanner } from "@/components/dashboard/subscription-banner"
import { UsageStats } from "@/components/dashboard/usage-stats"

// Simuliamo un utente autenticato
const mockUser = {
  id: "1",
  name: "Mario Rossi",
  email: "mario.rossi@esempio.it",
  plan: "free", // 'free', 'pro', 'business'
  usage: {
    messagesUsed: 15,
    messagesLimit: 20,
    imagesGenerated: 0,
    imagesLimit: 0,
    filesUploaded: 0,
    filesLimit: 0,
  },
}

export default function DashboardPage() {
  const [user, setUser] = useState(mockUser)

  // In un'implementazione reale, qui recupereremmo i dati dell'utente
  useEffect(() => {
    // Simuliamo il recupero dei dati dell'utente
    const fetchUserData = async () => {
      // const response = await fetch('/api/user');
      // const userData = await response.json();
      // setUser(userData);
    }

    // fetchUserData();
  }, [])

  return (
    <DashboardShell>
      <DashboardHeader heading="Dashboard" text="Benvenuto nella tua dashboard personale." user={user} />

      {user.plan === "free" && <SubscriptionBanner />}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messaggi Rimanenti</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {user.plan === "free"
                ? `${user.usage.messagesLimit - user.usage.messagesUsed}/${user.usage.messagesLimit}`
                : "Illimitati"}
            </div>
            <p className="text-xs text-muted-foreground">
              {user.plan === "free"
                ? "Limite giornaliero"
                : "Piano " + user.plan.charAt(0).toUpperCase() + user.plan.slice(1)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Generazione Immagini</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {user.plan === "free"
                ? "Non disponibile"
                : user.plan === "pro"
                  ? `${user.usage.imagesGenerated}/10`
                  : "Illimitata"}
            </div>
            <p className="text-xs text-muted-foreground">
              {user.plan === "free"
                ? "Aggiorna per sbloccare"
                : user.plan === "pro"
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
              {user.plan === "free" ? "Non disponibile" : user.plan === "pro" ? "10MB max" : "100MB max"}
            </div>
            <p className="text-xs text-muted-foreground">
              {user.plan === "free"
                ? "Aggiorna per sbloccare"
                : `Piano ${user.plan.charAt(0).toUpperCase() + user.plan.slice(1)}`}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stato Abbonamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {user.plan === "free" ? "Free" : user.plan === "pro" ? "Pro" : "Business"}
            </div>
            <p className="text-xs text-muted-foreground">
              {user.plan === "free" ? "Funzionalità limitate" : "Abbonamento attivo"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="chat" className="mt-6">
        <TabsList>
          <TabsTrigger value="chat">Chat AI</TabsTrigger>
          <TabsTrigger value="usage">Utilizzo</TabsTrigger>
          {(user.plan === "pro" || user.plan === "business") && (
            <TabsTrigger value="images">Generazione Immagini</TabsTrigger>
          )}
          {user.plan === "business" && <TabsTrigger value="api">API</TabsTrigger>}
        </TabsList>
        <TabsContent value="chat" className="mt-6">
          <ChatInterface user={user} />
        </TabsContent>
        <TabsContent value="usage" className="mt-6">
          <UsageStats user={user} />
        </TabsContent>
        {(user.plan === "pro" || user.plan === "business") && (
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
        {user.plan === "business" && (
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

