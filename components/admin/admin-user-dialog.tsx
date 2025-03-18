"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface AdminUserDialogProps {
  user: any
  open: boolean
  onOpenChange: (open: boolean) => void
  onUserUpdated: (user: any) => void
}

export function AdminUserDialog({ user, open, onOpenChange, onUserUpdated }: AdminUserDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<any>(null)

  // Aggiorna i dati del form quando l'utente cambia
  if (user && (!formData || formData.id !== user.id)) {
    setFormData({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role || "user",
      emailVerified: user.emailVerified,
      planId: user.subscription?.planId || "FREE",
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData) return

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch("/api/admin/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: formData.id,
          data: {
            name: formData.name,
            email: formData.email,
            role: formData.role,
            emailVerified: formData.emailVerified ? new Date() : null,
            subscription: {
              update: {
                planId: formData.planId,
              },
            },
          },
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Errore durante l'aggiornamento dell'utente")
      }

      const updatedUser = await response.json()
      onUserUpdated(updatedUser)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Si è verificato un errore")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user || !formData) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifica Utente</DialogTitle>
          <DialogDescription>Modifica i dettagli dell'utente e il piano di abbonamento.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          {error && <div className="text-sm text-red-500 mb-4">{error}</div>}
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nome
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Ruolo
              </Label>
              <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Seleziona un ruolo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Utente</SelectItem>
                  <SelectItem value="admin">Amministratore</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="plan" className="text-right">
                Piano
              </Label>
              <Select value={formData.planId} onValueChange={(value) => setFormData({ ...formData, planId: value })}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Seleziona un piano" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FREE">Free</SelectItem>
                  <SelectItem value="PRO">Pro</SelectItem>
                  <SelectItem value="BUSINESS">Business</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="verified" className="text-right">
                Verificato
              </Label>
              <div className="flex items-center space-x-2 col-span-3">
                <Switch
                  id="verified"
                  checked={formData.emailVerified}
                  onCheckedChange={(checked) => setFormData({ ...formData, emailVerified: checked })}
                />
                <Label htmlFor="verified">{formData.emailVerified ? "Sì" : "No"}</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvataggio..." : "Salva modifiche"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

