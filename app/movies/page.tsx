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

export default function MoviesPage() {
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
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">Movies</h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Manage your favorite movies and recommendations
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <p className="text-gray-500 dark:text-gray-400">
                  Movies management coming soon...
                </p>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
