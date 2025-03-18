import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { formatDistanceToNow } from "date-fns"
import { it } from "date-fns/locale"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date) {
  return formatDistanceToNow(date, {
    addSuffix: true,
    locale: it,
  })
}

export function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
}

export function truncateText(text: string, length: number) {
  if (text.length <= length) return text
  return text.substring(0, length) + "..."
}

export function isAdmin(user: any) {
  return user?.role === "admin"
}

export function getSubscriptionPlan(user: any) {
  if (isAdmin(user)) {
    return {
      name: "Admin",
      messagesLimit: null,
      imagesLimit: null,
      fileUploadLimit: null,
      isAdmin: true,
    }
  }

  const plan = user?.subscription?.planId || "FREE"

  switch (plan) {
    case "PRO":
      return {
        name: "Pro",
        messagesLimit: null,
        imagesLimit: 10,
        fileUploadLimit: 10 * 1024 * 1024, // 10MB
      }
    case "BUSINESS":
      return {
        name: "Business",
        messagesLimit: null,
        imagesLimit: null,
        fileUploadLimit: 100 * 1024 * 1024, // 100MB
      }
    default:
      return {
        name: "Free",
        messagesLimit: 20,
        imagesLimit: 0,
        fileUploadLimit: 0,
      }
  }
}

