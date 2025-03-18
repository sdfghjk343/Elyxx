"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, CreditCard } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"

// Simuliamo un utente autenticato
const mockUser = {
  id: "1",
  name: "Mario Rossi",
  email: "mario.rossi@esempio.it",
  plan: "free",
}

export default function UpgradePage() {
  const [selectedPlan, setSelectedPlan] = useState("pro")
  const [billingCycle, setBillingCycle] = useState("monthly")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const plans = [
    {
      id: "pro",
      name: "Pro",
      description: "Per utenti individuali che necessitano di più potenza",
      price: { monthly: "€9.99", annually: "€99.90" },
      features: [
        "Messaggi illimitati",
        "Memoria contestuale avanzata",
        "Generazione di testi avanzata",
        "Assistenza codice",
        "Caricamento file (fino a 10MB)",
        "Supporto prioritario",
      ],
    },
    {
      id: "business",
      name: "Business",
      description: "Per team e aziende con esigenze avanzate",
      price: { monthly: "€29.99", annually: "€299.90" },
      features: [
        "Tutto ciò che è incluso in Pro",
        "Generazione di immagini illimitata",
        "API access",
        "Caricamento file (fino a 100MB)",
        "Funzionalità di collaborazione",
        "Analisi avanzate",
        "Supporto dedicato 24/7",
      ],
    },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simuliamo una chiamata API per l'aggiornamento dell'abbonamento
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // In un'implementazione reale, qui chiameremmo l'API di pagamento
      // const response = await fetch('/api/subscription/upgrade', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ plan: selectedPlan, billingCycle }),
      // });

      // if (!response.ok) throw new Error('Errore durante l\'aggiornamento dell\'abbonamento');

      setIsSuccess(true)
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedPlanData = plans.find((plan) => plan.id === selectedPlan)

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Upgrade"
        text="Aggiorna il tuo piano per sbloccare tutte le funzionalità."
        user={mockUser}
      />

      {isSuccess ? (
        <Card>
          <CardHeader>
            <CardTitle>Abbonamento Aggiornato!</CardTitle>
            <CardDescription>
              Grazie per aver aggiornato il tuo piano. Il tuo nuovo abbonamento è ora attivo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <div className="rounded-full bg-green-100 p-3">
                <Check className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-medium">Piano {selectedPlanData?.name}</h3>
              <p className="text-sm text-muted-foreground">
                {billingCycle === "monthly" ? "Fatturazione mensile" : "Fatturazione annuale"}
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <a href="/dashboard">Torna alla Dashboard</a>
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <>
          <Tabs defaultValue="monthly" className="w-full" onValueChange={(value) => setBillingCycle(value)}>
            <div className="flex justify-center mb-8">
              <TabsList>
                <TabsTrigger value="monthly">Mensile</TabsTrigger>
                <TabsTrigger value="annually">Annuale (2 mesi gratis)</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="monthly" className="mt-0">
              <div className="grid gap-6 lg:grid-cols-2">
                {plans.map((plan) => (
                  <Card key={plan.id} className={selectedPlan === plan.id ? "border-primary" : ""}>
                    <CardHeader>
                      <CardTitle>{plan.name}</CardTitle>
                      <CardDescription>{plan.description}</CardDescription>
                      <div className="mt-4 text-3xl font-bold">
                        {plan.price.monthly}
                        <span className="text-sm font-normal text-muted-foreground">/mese</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value={plan.id} id={plan.id} />
                          <Label htmlFor={plan.id}>Seleziona Piano {plan.name}</Label>
                        </div>
                      </RadioGroup>
                      <ul className="mt-4 space-y-2">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-center">
                            <Check className="h-4 w-4 text-primary mr-2" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="annually" className="mt-0">
              <div className="grid gap-6 lg:grid-cols-2">
                {plans.map((plan) => (
                  <Card key={plan.id} className={selectedPlan === plan.id ? "border-primary" : ""}>
                    <CardHeader>
                      <CardTitle>{plan.name}</CardTitle>
                      <CardDescription>{plan.description}</CardDescription>
                      <div className="mt-4 text-3xl font-bold">
                        {plan.price.annually}
                        <span className="text-sm font-normal text-muted-foreground">/anno</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value={plan.id} id={`${plan.id}-annual`} />
                          <Label htmlFor={`${plan.id}-annual`}>Seleziona Piano {plan.name}</Label>
                        </div>
                      </RadioGroup>
                      <ul className="mt-4 space-y-2">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-center">
                            <Check className="h-4 w-4 text-primary mr-2" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <form onSubmit={handleSubmit} className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Informazioni di Pagamento</CardTitle>
                <CardDescription>Inserisci i dettagli della tua carta per completare l'acquisto.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome sulla carta</Label>
                  <Input id="name" placeholder="Mario Rossi" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="card">Numero carta</Label>
                  <div className="flex">
                    <Input id="card" placeholder="4242 4242 4242 4242" required />
                    <CreditCard className="ml-2 h-4 w-4 opacity-50 self-center" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Data di scadenza</Label>
                    <Input id="expiry" placeholder="MM/AA" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvc">CVC</Label>
                    <Input id="cvc" placeholder="123" required />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting
                    ? "Elaborazione in corso..."
                    : `Paga ${selectedPlanData?.price[billingCycle as "monthly" | "annually"]}`}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </>
      )}
    </DashboardShell>
  )
}

