import type React from "react"
import { MainNav } from "@/components/dashboard/main-nav"

interface DashboardShellProps {
  children: React.ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1 container py-6 md:py-10">
        <div className="space-y-6">{children}</div>
      </main>
    </div>
  )
}

