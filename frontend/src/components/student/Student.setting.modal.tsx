"use client"

import { useState } from "react"
import { useAppDispatch } from "@/app/store/hooks" 
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { logout } from "@/app/store/authSlice"
import { useRouter } from "next/navigation"

import ChangeEmailModal from "../shared/change.Email.modal"
import ChangeMobileModal from "../shared/change.mobile.modal"
import ResetPasswordModal from "../shared/resetPasswordModal"

export default function SettingsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [view, setView] = useState<"main" | "email" | "password" | "mobile" | "logoutConfirm">("main")
  const dispatch = useAppDispatch()
  const router= useRouter()
  const handleLogout = () => {
    dispatch(logout())
    router.push('/student/login')
    onClose() 
  }
  
  const renderContent = () => {
    switch (view) {
      case "email":
        return <ChangeEmailModal onBack={() => setView("main")} />

      case "password":
        return <ResetPasswordModal onBack={() => setView("main")} />

      case "mobile":
        return <ChangeMobileModal onBack={() => setView("main")} />

      case "logoutConfirm":
        return (
          <div className="flex flex-col gap-4 items-end">
            <p className="text-white text-right">Are you sure you want to logout?</p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="bg-gray-200 text-black hover:bg-gray-300"
                onClick={() => setView("main")}
              >
                Cancel
              </Button>
              <Button
                variant="outline"
                className="bg-red-600 text-white hover:bg-red-500"
                onClick={handleLogout}
              >
                Yes, Logout
              </Button>
            </div>
          </div>
        )

      default:
        return (
          <div className="flex flex-col gap-4 text-right">
            <Button
              variant="outline"
              className="bg-purple-900 text-white hover:bg-purple-800"
              onClick={() => setView("email")}
            >
              Change Email
            </Button>
            <Button
              variant="outline"
              className="bg-purple-900 text-white hover:bg-purple-800"
              onClick={() => setView("password")}
            >
              Change Password
            </Button>
            <Button
              variant="outline"
              className="bg-purple-900 text-white hover:bg-purple-800"
              onClick={() => setView("mobile")}
            >
              Change Mobile Number
            </Button>
            <Button
              variant="outline"
              className="bg-red-600 text-white hover:bg-red-500"
              onClick={() => setView("logoutConfirm")}
            >
              Logout
            </Button>
          </div>
        )
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-purple-600 text-white rounded-xl border-purple-700 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-lg text-purple-200">Settings</DialogTitle>
        </DialogHeader>
        {renderContent()}
      </DialogContent>
    </Dialog>
  )
}
