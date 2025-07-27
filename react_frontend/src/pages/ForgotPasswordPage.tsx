import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Alert, AlertDescription } from "../components/ui/alert"
import { Eye, EyeOff, Mail, Shield, Lock, ArrowLeft } from "lucide-react"
import { toast } from "react-toastify"
import { generateOtp, resetPassword, verifyOtp } from "../store/api"
import type { AxiosError } from "axios"


type StepType = "email" | "otp" | "reset"

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState("")
    const [otp, setOtp] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [step, setStep] = useState<StepType>("email")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSendOtp = async () => {
        if (!email.trim()) {
            setError("Please enter your email address")
            return
        }

        setLoading(true)
        setError("")

        try {
            await generateOtp(email)
            setStep("otp")
            toast.success("OTP sent to your email successfully")
        } catch (err) {
            const error = err as AxiosError<{ message: string }>
            setError(error.response?.data.message || "Failed to send otp")
        } finally {
            setLoading(false)
        }
    }

    const handleVerifyOtp = async () => {
        if (!otp.trim()) {
            setError("Please enter the OTP")
            return
        }

        setLoading(true)
        setError("")

        try {
            await verifyOtp(otp, email)
            setStep("reset")
            toast.success("OTP verified successfully")
        } catch (err) {
            const error = err as AxiosError<{ message: string }>
            setError(error.response?.data.message || "Failed to send otp")
        } finally {
            setLoading(false)
        }
    }

    const handleResetPassword = async () => {
        if (!newPassword.trim() || !confirmPassword.trim()) {
            setError("Please fill in both password fields")
            return
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match")
            return
        }

        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters long")
            return
        }

        setLoading(true)
        setError("")

        try {

            await resetPassword(email, newPassword,)
            toast.success("Password reset successful! Redirecting to login...")
            setTimeout(() => navigate("/guest/login"), 2000)
        } catch (err) {
            const error = err as AxiosError<{ message: string }>
            setError(error.response?.data.message || "Failed to send otp")
        } finally {
            setLoading(false)
        }
    }

    const handleBack = () => {
        if (step === "otp") {
            setStep("email")
            setOtp("")
        } else if (step === "reset") {
            setStep("otp")
            setNewPassword("")
            setConfirmPassword("")
        }
        setError("")
    }

    const getStepIcon = () => {
        switch (step) {
            case "email":
                return <Mail className="w-6 h-6 text-primary" />
            case "otp":
                return <Shield className="w-6 h-6 text-primary" />
            case "reset":
                return <Lock className="w-6 h-6 text-primary" />
        }
    }

    const getStepDescription = () => {
        switch (step) {
            case "email":
                return "Enter your email address to receive a verification code"
            case "otp":
                return "Enter the verification code sent to your email"
            case "reset":
                return "Create a new secure password for your account"
        }
    }

    return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-400/5 rounded-full blur-3xl"></div>
      </div>

      <Card className=" w-auto max-w-md relative z-10 shadow-2xl  bg-purple-500/20 backdrop-blur-lg border border-purple-500/30">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-3 bg-purple-100/20 rounded-full border border-purple-400/30">
              {getStepIcon()}
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-white">Reset Password</CardTitle>
            <CardDescription className="mt-2 text-purple-200">
              {getStepDescription()}
            </CardDescription>
          </div>
          
          {/* Progress indicator */}
          <div className="flex justify-center space-x-2">
            <div className={`w-2 h-2 rounded-full transition-colors ${
              step === "email" ? "bg-purple-300" : "bg-purple-500/50"
            }`} />
            <div className={`w-2 h-2 rounded-full transition-colors ${
              step === "otp" ? "bg-purple-300" : "bg-purple-500/50"
            }`} />
            <div className={`w-2 h-2 rounded-full transition-colors ${
              step === "reset" ? "bg-purple-300" : "bg-purple-500/50"
            }`} />
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive" className="bg-red-900/20 border-red-500/50 text-red-300">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {step === "email" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-purple-200">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-purple-400" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-purple-800/30 border-purple-600/50 text-white placeholder:text-purple-300 focus:border-purple-400 focus:ring-purple-400"
                    placeholder="Enter your email address"
                    disabled={loading}
                  />
                </div>
              </div>
              <Button
                onClick={handleSendOtp}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold shadow-lg hover:shadow-purple-500/25 transition-all duration-200"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Verification Code"}
              </Button>
            </div>
          )}

          {step === "otp" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp" className="text-purple-200">Verification Code</Label>
                <div className="relative">
                  <Shield className="absolute left-3 top-3 h-4 w-4 text-purple-400" />
                  <Input
                    id="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="pl-10 text-center text-lg tracking-wider bg-purple-800/30 border-purple-600/50 text-white placeholder:text-purple-300 focus:border-purple-400 focus:ring-purple-400"
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="flex-1 border-purple-600/50 text-purple-200 hover:bg-purple-800/30 hover:text-white"
                  disabled={loading}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button
                  onClick={handleVerifyOtp}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold shadow-lg hover:shadow-purple-500/25 transition-all duration-200"
                  disabled={loading}
                >
                  {loading ? "Verifying..." : "Verify Code"}
                </Button>
              </div>
            </div>
          )}

          {step === "reset" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-purple-200">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-purple-400" />
                  <Input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pl-10 pr-10 bg-purple-800/30 border-purple-600/50 text-white placeholder:text-purple-300 focus:border-purple-400 focus:ring-purple-400"
                    placeholder="Enter new password"
                    disabled={loading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-purple-400 hover:text-purple-300"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-purple-200">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-purple-400" />
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 pr-10 bg-purple-800/30 border-purple-600/50 text-white placeholder:text-purple-300 focus:border-purple-400 focus:ring-purple-400"
                    placeholder="Confirm new password"
                    disabled={loading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-purple-400 hover:text-purple-300"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="flex-1 border-purple-600/50 text-purple-200 hover:bg-purple-800/30 hover:text-white"
                  disabled={loading}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button
                  onClick={handleResetPassword}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold shadow-lg hover:shadow-purple-500/25 transition-all duration-200"
                  disabled={loading}
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </Button>
              </div>
            </div>
          )}

          <div className="text-center">
            <Button
              variant="link"
              onClick={() => navigate("/guest/login")}
              className="text-sm text-purple-300 hover:text-white transition-colors"
            >
              Back to Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ForgotPasswordPage