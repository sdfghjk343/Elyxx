"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, ChevronLeft, ChevronRight, Edit, UserCheck, UserX } from 'lucide-react'
import { formatDate } from "@/lib/utils"
import { AdminUserDialog } from "@/components/admin/admin-user-dialog"

export function AdminUserList() {
  const [users, setUsers] = useState<any[]>([])
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  })
  const [search, setSearch] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const fetchUsers = async () => {
    try {
      setIsLoading(true)

      const queryParams = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      })

      if (search) {
        queryParams.append("search", search)
      }

      const response = await fetch(`/api/admin/users?${queryParams}`)

      if (!response.ok) {
        throw new Error("Errore nel recupero degli utenti")
      }

      const data = await response.json()
      setUsers(data.users)
      setPagination(data.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Si è verificato un errore")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [pagination.page, search])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPagination((prev) => ({ ...prev, page: 1 }))
    fetchUsers()
  }

  const handlePrevPage = () => {
    if (pagination.page > 1) {
      setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
    }
  }

  const handleNextPage = () => {
    if (pagination.page < pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
    }
  }

  const handleEditUser = (user: any) => {
    setSelectedUser(user)
    setIsDialogOpen(true)
  }

  const handleUserUpdated = (updatedUser: any) => {
    setUsers(users.map((user) => (user.id === updatedUser.id ? updatedUser : user)))
    setIsDialogOpen(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestione Utenti</CardTitle>
        <CardDescription>Visualizza e gestisci gli utenti della piattaforma</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSearch} className="flex items-center space-x-2 mb-4">
          <Input
            placeholder="Cerca per nome o email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </form>

        {error ? (
          <div className="text-center py-4 text-red-500">{error}</div>
        ) : isLoading ? (
          <div className="text-center py-4">Caricamento...</div>
        ) : users.length === 0 ? (
          <div className="text-center py-4">Nessun utente trovato</div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Piano</TableHead>
                  <TableHead>Stato</TableHead>
                  <TableHead>Registrato</TableHead>
                  <TableHead>Azioni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.subscription?.planId === "BUSINESS"
                            ? "default"
                            : user.subscription?.planId === "PRO"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {user.subscription?.planId || "FREE"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.emailVerified ? (
                        <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                          Verificato
                        </Badge>
                      ) : (
                        <Badge variant="destructive">Non verificato</Badge>
                      )}
                    </TableCell>
                    <TableCell>{formatDate(new Date(user.createdAt))}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEditUser(user)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditUser({ ...user, emailVerified: !user.emailVerified })}
                        >
                          {user.emailVerified ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Mostrando {users.length} di {pagination.total} utenti
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={handlePrevPage} disabled={pagination.page <= 1}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-sm">
            Pagina {pagination.page} di {pagination.totalPages}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNextPage}
            disabled={pagination.page >= pagination.totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>

      <AdminUserDialog
        user={selectedUser}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onUserUpdated={handleUserUpdated}
      />
    </Card>
  )
}