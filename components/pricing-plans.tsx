"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export function PricingPlans() {
  const [annual, setAnnual] = useState(false)

  const plans = [
    {
      name: "Free",
      description: "Per iniziare con le funzionalità di base",
      price: { monthly: "€0", annually: "€0" },
      features: [
        "Limite di 20 messaggi al giorno",
        "Accesso alle funzionalità di base",
        "Risposte testuali semplici",
        "Nessuna memoria contestuale",
        "Supporto via email",
      ],
      limitations: ["Nessuna generazione di immagini", "Nessuna assistenza codice", "Nessun caricamento file"],
      cta: "Inizia Gratis",
      href: "/register",
      popular: false,
    },
    {
      name: "Pro",
      description: "Per utenti individuali che necessitano di più potenza",
      price: { monthly: "€9.99", annually: "€99.90" },
      features: [
        "Messaggi illimitati",
        "Tutte le funzionalità di base",
        "Memoria contestuale avanzata",
        "Generazione di testi avanzata",
        "Assistenza codice",
        "Caricamento file (fino a 10MB)",
        "Supporto prioritario",
      ],
      limitations: ["Generazione di immagini limitata"],
      cta: "Abbonati a Pro",
      href: "/register?plan=pro",
      popular: true,
    },
    {
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
        "Personalizzazione dell'AI",
      ],
      cta: "Abbonati a Business",
      href: "/register?plan=business",
      popular: false,
    },
  ]

  return (
    <div className="space-y-8">
      <div className="flex justify-center items-center space-x-2">
        <Label htmlFor="billing-toggle">Mensile</Label>
        <Switch id="billing-toggle" checked={annual} onCheckedChange={setAnnual} />
        <Label htmlFor="billing-toggle">
          Annuale <span className="text-sm text-primary">(2 mesi gratis)</span>
        </Label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <Card key={plan.name} className={`flex flex-col ${plan.popular ? "border-primary shadow-lg" : ""}`}>
            {plan.popular && (
              <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                  Più Popolare
                </span>
              </div>
            )}
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">{annual ? plan.price.annually : plan.price.monthly}</span>
                <span className="text-gray-500 dark:text-gray-400 ml-2">{annual ? "/anno" : "/mese"}</span>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
                {plan.limitations &&
                  plan.limitations.map((limitation) => (
                    <li key={limitation} className="flex items-start text-gray-500">
                      <span className="h-5 w-5 text-gray-300 mr-2 flex items-center justify-center text-lg">-</span>
                      <span>{limitation}</span>
                    </li>
                  ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full" variant={plan.popular ? "default" : "outline"}>
                <Link href={plan.href}>{plan.cta}</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

