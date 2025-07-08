"use client"

import React, { useState } from "react"
import { Bell, Search, Settings, LogOut, User } from "lucide-react"
import { useAppSelector, useAppDispatch } from "@/app/store/hooks" 
import { clearStudent } from "@/app/store/studentSlice"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SidebarTrigger } from "@/components/ui/sidebar"
import SettingsModal from "./Student.setting.modal"

export function StudentHeader() {
  const { student } = useAppSelector((state) => state.student)
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [settingsOpen, setSettingsOpen] = useState(false)

  const handleLogout = () => {
    dispatch(clearStudent())
    router.push("/student/login")
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-purple-700/50 bg-purple-900/80 backdrop-blur-sm px-4">
        <SidebarTrigger className="-ml-1 text-purple-200 hover:bg-purple-800 hover:text-white" />

        <div className="flex flex-1 items-center gap-4">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-purple-300" />
            <Input placeholder="Search..." className="pl-10 bg-purple-800/50 border-purple-600 text-purple-100 placeholder:text-purple-300" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-purple-200 hover:bg-purple-800 hover:text-white">
            <Bell className="h-4 w-4" />
          </Button>

          <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />

          <Button 
            variant="purpleGradient" 
            size="icon" 
            onClick={() => setSettingsOpen(true)}
            className="text-white hover:from-purple-600 hover:to-purple-800"
          >
            <Settings className="h-4 w-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={student?.profileImage || "/placeholder.svg"} alt={student?.name || "Student"} />
                  <AvatarFallback className="bg-purple-700 text-white">{student?.name ? getInitials(student.name) : "S"}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-purple-900 border-purple-700 text-purple-100" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium text-purple-100">{student?.name || "Student"}</p>
                  <p className="text-xs text-purple-200">{student?.email || "student@example.com"}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-purple-700/50" />
              <DropdownMenuItem asChild className="hover:bg-purple-800 hover:text-white">
                <a href="/student/profile" className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="hover:bg-purple-800 hover:text-white">
                <a href="/student/settings" className="flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </a>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-purple-700/50" />
              <DropdownMenuItem onClick={handleLogout} className="hover:bg-purple-800 hover:text-white">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex items-center gap-2 text-sm">
            <span className="text-purple-200">Hello</span>
            <span className="font-medium text-white">{student?.name?.split(" ")[0] || "Lines"}</span>
          </div>
        </div>
      </header>
    </>
  )
}
