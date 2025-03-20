"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { useSession } from "next-auth/react"

export function MainNav() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === "admin"

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">AI Platform</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link
              href="/dashboard"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === "/dashboard" ? "text-primary" : "text-muted-foreground",
              )}
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/chat"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === "/dashboard/chat" ? "text-primary" : "text-muted-foreground",
              )}
            >
              Chat
            </Link>
            <Link
              href="/dashboard/settings"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === "/dashboard/settings" ? "text-primary" : "text-muted-foreground",
              )}
            >
              Impostazioni
            </Link>
            {isAdmin && (
              <Link
                href="/dashboard/admin"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname.startsWith("/dashboard/admin") ? "text-primary" : "text-muted-foreground",
                )}
              >
                Admin
              </Link>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <Button asChild variant="ghost" size="sm" className="hidden md:flex">
            <Link href="/dashboard/upgrade">Upgrade</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}

