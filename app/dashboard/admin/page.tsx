"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { AdminUserList } from "@/components/admin/admin-user-list"
import { AdminStats } from "@/components/admin/admin-stats"
import { AdminSettings } from "@/components/admin/admin-settings"
import { isAdmin } from "@/lib/utils"

// Disabilita la pre-renderizzazione statica
export const dynamic = "force-dynamic"

export default function AdminDashboardPage() {
  // Evita di eseguire il codice se siamo nel server
  const isClient = typeof window !== "undefined"
  const session = isClient ? useSession() : null
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isClient || !session) return

    if (session.status === "unauthenticated" || !session.data?.user || !isAdmin(session.data.user)) {
      router.push("/dashboard")
    } else {
      setIsLoading(false)
    }
  }, [session, router, isClient])

  if (!isClient || isLoading || session?.status === "loading") {
    return (
      <DashboardShell>
        <DashboardHeader
          heading="Pannello di Amministrazione"
          text="Caricamento..."
          user={{
            name: session?.data?.user?.name || "Amministratore",
            email: session?.data?.user?.email || "admin@example.com",
            plan: session?.data?.user?.subscription?.planId || "free",
          }}
        />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Pannello di Amministrazione"
        text="Gestisci utenti, visualizza statistiche e configura la piattaforma."
        user={{
          name: session?.data?.user?.name || "Amministratore",
          email: session?.data?.user?.email || "admin@example.com",
          plan: session?.data?.user?.subscription?.planId || "free",
        }}
      />

      <Tabs defaultValue="stats" className="mt-6">
        <TabsList>
          <TabsTrigger value="stats">Statistiche</TabsTrigger>
          <TabsTrigger value="users">Utenti</TabsTrigger>
          <TabsTrigger value="settings">Impostazioni</TabsTrigger>
        </TabsList>
        <TabsContent value="stats" className="mt-6">
          <AdminStats />
        </TabsContent>
        <TabsContent value="users" className="mt-6">
          <AdminUserList />
        </TabsContent>
        <TabsContent value="settings" className="mt-6">
          <AdminSettings />
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}
