import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

export function SubscriptionBanner() {
  return (
    <div className="relative w-full rounded-lg border bg-background p-6 shadow-sm">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="flex-grow">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            <h3 className="text-lg font-semibold">Sblocca Tutte le Funzionalità</h3>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Passa a un piano premium per accedere a messaggi illimitati, generazione di immagini e molto altro.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/upgrade">Upgrade</Link>
        </Button>
      </div>
    </div>
  )
}

