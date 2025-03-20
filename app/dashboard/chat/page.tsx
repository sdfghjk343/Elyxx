"use client"

import { useSession } from "next-auth/react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { ChatInterface } from "@/components/chat/chat-interface"

export const dynamic = "force-dynamic"

export default function ChatPage() {
  const { data: session } = useSession()

  // Dati utente simulati per la demo
  const mockUser = {
    id: "1",
    name: session?.user?.name || "Utente",
    email: session?.user?.email || "utente@esempio.it",
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

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Chat AI"
        text="Interagisci con la nostra intelligenza artificiale avanzata."
        user={userWithUsage}
      />

      <div className="mt-6">
        <ChatInterface user={userWithUsage} />
      </div>
    </DashboardShell>
  )
}

