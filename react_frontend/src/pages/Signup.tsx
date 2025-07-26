import { Link, useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { useDispatch } from "react-redux"
import { googleLogin, registerUser } from "../store/api"
import { login, userInfo } from "../store/authSlice"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { signupSchema } from "../utils/validationSchemas"
import { toast } from "react-toastify"
import type { AxiosError } from "axios"
import { useState } from "react"
import { jwtDecode } from 'jwt-decode';
import { GoogleLogin } from '@react-oauth/google';
import type { CredentialResponse } from '@react-oauth/google'


type SignUpFormData = {
  name: string
  email: string
  password: string
  confirmPassword: string
}


const SignupPage = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignUpFormData>({
    resolver: yupResolver(signupSchema),
  })

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const onSubmit = async (data: SignUpFormData) => {
    const { name, email, password } = data
    const role = "GUEST"

    try {
      const res = await registerUser(name, email, password, role)
      toast.success("Registration Successful")
      dispatch(login({ access_token: res.access_token, role: res.role, userId: res.userId }))
      dispatch(userInfo({ name: res.user.name, email: res.user.email }))
      navigate("/")
    } catch (error) {
      const err = error as AxiosError<{ message: string }>
      toast.error(err.response?.data.message || "Failed to sign up")
    }
  }

  const handleGoogleLogin = async (credentialResponse: CredentialResponse) => {
    const role = "GUEST"
    if (!credentialResponse.credential) {
      toast.error("Google login failed")
      return
    }

    const decoded = jwtDecode<{ email: string; name: string; sub: string }>(credentialResponse.credential)
    try {
      const { access_token, userId, user } = await googleLogin(
        decoded.email,
        decoded.name,
        role
      );
      dispatch(login({ access_token, role: user.role, userId }))
      dispatch(userInfo({ name: user.name, email: user.email }))
      navigate('/')
    } catch (error) {
      const err = error as AxiosError<{ message: string }>
      toast.error(err.response?.data.message || "Google login failed")
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
          <CardTitle className="text-2xl font-bold text-white">Sign Up</CardTitle>
          <CardDescription className="text-purple-200">Create your account to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-purple-200">Full Name</Label>
              <Input
                id="name"
                {...register("name")}
                className="bg-purple-700/30 border-purple-600/50 text-white placeholder:text-purple-300"
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="text-red-400 text-sm">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-purple-200">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                className="bg-purple-700/30 border-purple-600/50 text-white placeholder:text-purple-300"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-red-400 text-sm">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2 relative">
              <Label htmlFor="password" className="text-purple-200">Password</Label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                {...register("password")}
                className="bg-purple-700/30 border-purple-600/50 text-white placeholder:text-purple-300 pr-10"
                placeholder="Enter your password"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-9 right-3 text-purple-300 cursor-pointer"
              >
                {showPassword ? "👁️" : "🙈"}
              </span>
              {errors.password && (
                <p className="text-red-400 text-sm">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2 relative">
              <Label htmlFor="confirmPassword" className="text-purple-200">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword")}
                className="bg-purple-700/30 border-purple-600/50 text-white placeholder:text-purple-300 pr-10"
                placeholder="Confirm your password"
              />
              <span
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute top-9 right-3 text-purple-300 cursor-pointer"
              >
                {showConfirmPassword ? "👁️" : "🙈"}
              </span>
              {errors.confirmPassword && (
                <p className="text-red-400 text-sm">{errors.confirmPassword.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating Account..." : "Sign Up"}
            </Button>
          </form>

          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-400"></div>
            <span className="px-4 text-gray-300 text-sm">or</span>
            <div className="flex-1 border-t border-gray-400"></div>
          </div>

          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => {
              toast.error("Google Sign-in Failed");
            }}
          />

          <div className="mt-6 text-center">
            <p className="text-purple-200">
              Already have an account?{" "}
              <Link to="/guest/login" className="text-amber-400 hover:text-amber-300 font-semibold">
                Sign In
              </Link>
            </p>
            <p className="text-purple-200 mt-2">
              Forgot your password?{" "}
              <Link to="/guest/forgot-password" className="text-amber-400 hover:text-amber-300 font-semibold">
                Reset Password
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default SignupPage