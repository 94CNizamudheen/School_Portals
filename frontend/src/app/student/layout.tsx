"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Provider } from "react-redux"
import { store } from "../store/store"

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { StudentSidebar } from "@/components/student/Sidebar"
import { StudentHeader } from "@/components/student/Header"

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  const excludedPages = ["/student/login", "/student/reset-password"]
  const shouldShowLayout = !excludedPages.includes(pathname)

  useEffect(() => {

    const token = localStorage.getItem("token")

    if (!token && shouldShowLayout) {

      router.push("/student/login")
    } else {
      setIsAuthenticated(true)
    }
  }, [pathname, router, shouldShowLayout])



  if (isAuthenticated === null && shouldShowLayout) {
    return null // or a loading spinner if you want
  }

  // Pages without layout (login, reset-password)
  if (!shouldShowLayout) {
    return <Provider store={store}>{children}</Provider>
  }

  // Protected layout
  return (
    <Provider store={store}>
      <SidebarProvider>
        <StudentSidebar />
        <SidebarInset>
          <StudentHeader />
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0 bg-gradient-to-br from-purple-900 via-purple-800 to-purple-700 min-h-screen">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </Provider>
  )
}
