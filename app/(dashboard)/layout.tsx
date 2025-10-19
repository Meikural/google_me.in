"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { LinksProvider } from "@/contexts/LinksContext"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [isCheckingUser, setIsCheckingUser] = useState(true)

  useEffect(() => {
    if (!isLoaded) return

    if (!user) {
      router.push("/")
      return
    }

    // Check if user exists in our database
    const checkUserExists = async () => {
      try {
        const response = await fetch("/api/links")
        const data = await response.json()

        if (response.status === 404 && data.error === "User not found") {
          // User hasn't set up username yet, redirect to setup
          router.push("/setup")
          return
        }

        setIsCheckingUser(false)
      } catch (error) {
        console.error("Error checking user:", error)
        setIsCheckingUser(false)
      }
    }

    checkUserExists()
  }, [isLoaded, user, router])

  if (!isLoaded || isCheckingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <LinksProvider>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "14rem",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              {children}
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </LinksProvider>
  )
}
