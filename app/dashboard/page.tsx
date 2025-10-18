"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

import data from "./data.json"

export default function Page() {
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
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
              <DataTable data={data} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
