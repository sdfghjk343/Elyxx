"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, CheckCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function AdminSettings() {
  const [activeTab, setActiveTab] = useState("general")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Impostazioni generali
  const [siteName, setSiteName] = useState("AI Platform")
  const [siteDescription, setSiteDescription] = useState("Piattaforma AI avanzata con abbonamenti")
  const [logoUrl, setLogoUrl] = useState("")
  const [primaryColor, setPrimaryColor] = useState("#0070f3")

  // Impostazioni email
  const [emailFrom, setEmailFrom] = useState("noreply@example.com")
  const [emailHost, setEmailHost] = useState("smtp.example.com")
  const [emailPort, setEmailPort] = useState("587")
  const [emailUser, setEmailUser] = useState("")
  const [emailPassword, setEmailPassword] = useState("")
  const [emailSecure, setEmailSecure] = useState(true)

  // Impostazioni AI
  const [aiModel, setAiModel] = useState("mistral-small")
  const [aiTemperature, setAiTemperature] = useState("0.7")
  const [aiMaxTokens, setAiMaxTokens] = useState("1000")
  const [aiSystemPrompt, setAiSystemPrompt] = useState(
    "Sei un assistente AI utile, rispettoso e onesto. Rispondi sempre nel modo più utile possibile, mantenendo un tono amichevole.",
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSuccess(null)
    setError(null)

    try {
      // Simuliamo il salvataggio delle impostazioni
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // In un'implementazione reale, qui chiameremmo l'API per salvare le impostazioni
      // const response = await fetch('/api/admin/settings', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     [activeTab]: {
      //       // Dati specifici per la scheda attiva
      //     }
      //   }),
      // });

      // if (!response.ok) throw new Error('Errore durante il salvataggio delle impostazioni');

      setSuccess("Impostazioni salvate con successo")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Si è verificato un errore")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Impostazioni Piattaforma</CardTitle>
        <CardDescription>Configura le impostazioni generali, email e AI della piattaforma</CardDescription>
      </CardHeader>
      <CardContent>
        {success && (
          <Alert className="mb-4 bg-green-50 border-green-200 text-green-800">
            <CheckCircle className="h-4 w-4 text-green-800" />
            <AlertTitle>Successo</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Errore</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="general">Generali</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="ai">AI</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="siteName">Nome Sito</Label>
                <Input id="siteName" value={siteName} onChange={(e) => setSiteName(e.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteDescription">Descrizione Sito</Label>
                <Textarea
                  id="siteDescription"
                  value={siteDescription}
                  onChange={(e) => setSiteDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="logoUrl">URL Logo</Label>
                <Input
                  id="logoUrl"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="https://example.com/logo.png"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="primaryColor">Colore Primario</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="primaryColor"
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-12 h-10 p-1"
                  />
                  <Input value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="flex-1" />
                </div>
              </div>

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Salvataggio..." : "Salva Impostazioni"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="email">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="emailFrom">Email Mittente</Label>
                <Input
                  id="emailFrom"
                  type="email"
                  value={emailFrom}
                  onChange={(e) => setEmailFrom(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emailHost">Host SMTP</Label>
                <Input id="emailHost" value={emailHost} onChange={(e) => setEmailHost(e.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emailPort">Porta SMTP</Label>
                <Input id="emailPort" value={emailPort} onChange={(e) => setEmailPort(e.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emailUser">Username SMTP</Label>
                <Input id="emailUser" value={emailUser} onChange={(e) => setEmailUser(e.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emailPassword">Password SMTP</Label>
                <Input
                  id="emailPassword"
                  type="password"
                  value={emailPassword}
                  onChange={(e) => setEmailPassword(e.target.value)}
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="emailSecure" checked={emailSecure} onCheckedChange={setEmailSecure} />
                <Label htmlFor="emailSecure">Usa connessione sicura (SSL/TLS)</Label>
              </div>

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Salvataggio..." : "Salva Impostazioni"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="ai">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="aiModel">Modello AI</Label>
                <Select value={aiModel} onValueChange={setAiModel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona un modello" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mistral-tiny">Mistral Tiny</SelectItem>
                    <SelectItem value="mistral-small">Mistral Small</SelectItem>
                    <SelectItem value="mistral-medium">Mistral Medium</SelectItem>
                    <SelectItem value="mistral-large">Mistral Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="aiTemperature">Temperatura</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="aiTemperature"
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={aiTemperature}
                    onChange={(e) => setAiTemperature(e.target.value)}
                    className="w-full"
                  />
                  <span>{aiTemperature}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="aiMaxTokens">Massimo Token</Label>
                <Input
                  id="aiMaxTokens"
                  type="number"
                  value={aiMaxTokens}
                  onChange={(e) => setAiMaxTokens(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="aiSystemPrompt">Prompt di Sistema</Label>
                <Textarea
                  id="aiSystemPrompt"
                  value={aiSystemPrompt}
                  onChange={(e) => setAiSystemPrompt(e.target.value)}
                  rows={5}
                  required
                />
              </div>

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Salvataggio..." : "Salva Impostazioni"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

