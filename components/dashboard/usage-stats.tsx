import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface UsageStatsProps {
  user: {
    plan: string
    usage: {
      messagesUsed: number
      messagesLimit: number
      imagesGenerated: number
      imagesLimit: number
      filesUploaded: number
      filesLimit: number
    }
  }
}

export function UsageStats({ user }: UsageStatsProps) {
  // Calcola le percentuali di utilizzo
  const messagePercentage = user.plan === "free" ? (user.usage.messagesUsed / user.usage.messagesLimit) * 100 : 0

  const imagePercentage =
    user.plan !== "free" && user.plan !== "business" && user.usage.imagesLimit > 0
      ? (user.usage.imagesGenerated / user.usage.imagesLimit) * 100
      : 0

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Statistiche di Utilizzo</CardTitle>
          <CardDescription>Monitora il tuo utilizzo delle funzionalità in base al tuo piano.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Messaggi</span>
              <span className="text-sm text-muted-foreground">
                {user.plan === "free" ? `${user.usage.messagesUsed}/${user.usage.messagesLimit}` : "Illimitati"}
              </span>
            </div>
            {user.plan === "free" && <Progress value={messagePercentage} className="h-2" />}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Generazione Immagini</span>
              <span className="text-sm text-muted-foreground">
                {user.plan === "free"
                  ? "Non disponibile"
                  : user.plan === "pro"
                    ? `${user.usage.imagesGenerated}/${user.usage.imagesLimit}`
                    : "Illimitata"}
              </span>
            </div>
            {user.plan === "pro" && user.usage.imagesLimit > 0 && <Progress value={imagePercentage} className="h-2" />}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Caricamento File</span>
              <span className="text-sm text-muted-foreground">
                {user.plan === "free" ? "Non disponibile" : user.plan === "pro" ? "10MB max" : "100MB max"}
              </span>
            </div>
          </div>

          <div className="pt-4 border-t">
            <div className="flex items-center justify-between">
              <span className="font-medium">Piano Attuale</span>
              <span className="font-medium">
                {user.plan === "free" ? "Free" : user.plan === "pro" ? "Pro" : "Business"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

