import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios, { AxiosError } from "axios"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { toast } from "react-toastify"
const API = import.meta.env.VITE_BACKEND_URL

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState("")
    const [otp, setOtp] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [step, setStep] = useState<"email" | "otp" | "reset">("email")
    const [error, setError] = useState("")
    const navigate = useNavigate()

    const handleSendOtp = async () => {
        try {
            await axios.post(`${API}/auth/otp/generate`, { email })
            setStep("otp")
            toast.success("OTP sent to your email")
        } catch (err) {
            const error = err as AxiosError<{ message: string }>
            setError(error.response?.data.message || "Failed to send OTP. Please check your email.")
        }
    }

    const handleVerifyOtp = async () => {
        try {
            await axios.post(`${API}/auth/otp/verify`, { email, code: otp })
            setStep("reset")
            toast.success("OTP verified successfully")
        } catch (err) {
            const error = err as AxiosError<{ message: string }>
            setError(error.response?.data.message || "Invalid or expired OTP")
        }
    }

    const handleResetPassword = async () => {
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match")
            return
        }
        try {
            await axios.post(`${API}/auth/reset-password`, {
                email,
                otp,
                newPassword,
            })
            toast.success("Password reset successful")
            navigate("/guest/login")
        } catch (err) {
            const error = err as AxiosError<{ message: string }>
            setError(error.response?.data.message || "Failed to reset password")
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center p-4">
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-20 left-40 w-32 h-32 bg-white rounded-full animate-pulse"></div>
                <div className="absolute top-40 right-20 w-24 h-24 bg-white rounded-full animate-fade-in-scale"></div>
                <div className="absolute bottom-20 left-20 w-40 h-40 bg-white rounded-full"></div>
                <div className="absolute bottom-40 right-80 w-28 h-28 bg-white rounded-full animate-bounce"></div>
            </div>
            <Card className="max-w-md bg-purple-800/20 border-purple-600/30 backdrop-blur-sm">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold text-white">Reset Password</CardTitle>
                    <CardDescription className="text-purple-200">
                        {step === "email" && "Enter your email to receive an OTP"}
                        {step === "otp" && "Enter the OTP sent to your email"}
                        {step === "reset" && "Enter your new password"}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {error && (
                        <div className="bg-red-500/20 text-red-300 p-3 rounded-full mb-4 text-center">
                            {error}
                        </div>
                    )}
                    <div className="space-y-4">
                        {step === "email" && (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-purple-200">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="bg-purple-700/30 border-purple-600/50 text-white placeholder:text-purple-300"
                                        placeholder="Enter your email"
                                    />
                                </div>
                                <Button
                                    onClick={handleSendOtp}
                                    className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold"
                                >
                                    Send OTP
                                </Button>
                            </>
                        )}

                        {step === "otp" && (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="otp" className="text-purple-200">OTP</Label>
                                    <Input
                                        id="otp"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        className="bg-purple-700/30 border-purple-600/50 text-white placeholder:text-purple-300"
                                        placeholder="Enter OTP"
                                    />
                                </div>
                                <Button
                                    onClick={handleVerifyOtp}
                                    className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold"
                                >
                                    Verify OTP
                                </Button>
                            </>
                        )}

                        {step === "reset" && (
                            <>
                                <div className="space-y-2 relative">
                                    <Label htmlFor="newPassword" className="text-purple-200">New Password</Label>
                                    <Input
                                        id="newPassword"
                                        type={showPassword ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="bg-purple-700/30 border-purple-600/50 text-white placeholder:text-purple-300 pr-10"
                                        placeholder="Enter new password"
                                    />
                                    <span
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute top-9 right-3 text-purple-300 cursor-pointer"
                                    >
                                        {showPassword ? "👁️" : "🙈"}
                                    </span>
                                </div>
                                <div className="space-y-2 relative">
                                    <Label htmlFor="confirmPassword" className="text-purple-200">Confirm Password</Label>
                                    <Input
                                        id="confirmPassword"
                                        type={showPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="bg-purple-700/30 border-purple-600/50 text-white placeholder:text-purple-300 pr-10"
                                        placeholder="Confirm new password"
                                    />
                                    <span
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute top-9 right-3 text-purple-300 cursor-pointer"
                                    >
                                        {showPassword ? "👁️" : "🙈"}
                                    </span>
                                </div>
                                <Button
                                    onClick={handleResetPassword}
                                    className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold"
                                >
                                    Reset Password
                                </Button>
                            </>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default ForgotPasswordPage