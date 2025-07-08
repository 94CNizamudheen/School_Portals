"use client"

import type * as React from "react"
import { Calendar, ClipboardList, GraduationCap, Home, User, Users, FileText, Clock, ChartArea, LogOut } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { useAppDispatch } from "@/app/store/hooks"
import { useRouter } from "next/navigation"
import { logout } from "@/app/store/authSlice"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const navigationItems = [
  {
    title: "Dashboard",
    url: "/student/dashboard",
    icon: Home,
  },
  {
    title: "Profile",
    url: "/student/profile",
    icon: User,
  },
  {
    title: "Time Table",
    url: "/student/timetable",
    icon: Clock,
  },
  {
    title: "Attendance",
    url: "/student/attendance",
    icon: Calendar,
  },
  {
    title: "Tasks/Homework",
    url: "/student/tasks",
    icon: ClipboardList,
  },
  {
    title: "Teachers",
    url: "/student/teachers",
    icon: Users,
  },
  {
    title: "Exams/Results",
    url: "/student/exams",
    icon: FileText,
  },
  {
    title: "Chat",
    url: "/student/chat",
    icon: ChartArea,
  },
  {
    title: "Logout",
    icon: LogOut,
  },
]

export function StudentSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const dispatch = useAppDispatch()
  const router = useRouter()

  return (
    <Sidebar variant="inset" className="bg-gradient-to-b from-purple-950 to-purple-900 border-r border-purple-700/50" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-600 text-white">
            <GraduationCap className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-purple-100">AMLP School</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-purple-200">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.title === "Logout" ? (
                    <SidebarMenuButton
                      onClick={() => {
                        dispatch(logout());
                        router.push("/student/login"); // redirect after logout
                      }}
                      className="text-purple-100 hover:bg-purple-800/50 hover:text-white"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  ) : (
                    item.url && (
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === item.url}
                        className="text-purple-100 hover:bg-purple-800/50 hover:text-white data-[active=true]:bg-purple-700 data-[active=true]:text-white"
                      >
                        <Link href={item.url}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    )
                  )}
                </SidebarMenuItem>
              ))}


            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}