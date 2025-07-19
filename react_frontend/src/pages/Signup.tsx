
import { Link, useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import {
  Card, CardContent, CardDescription,
  CardHeader, CardTitle
} from "../components/ui/card"
import { useDispatch } from "react-redux"
import { registerUser } from "../store/authThunks"
import { login } from "../store/authSlice"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { signupSchema } from "../utils/validationSchemas"
import { toast } from "react-toastify"
import type { AxiosError } from "axios"

type SignUpFormData = {
  name: string
  email: string
  password: string
  confirmPassword: string
}

const SignupPage = () => {
  const {register, handleSubmit,formState: { errors, isSubmitting }, } = useForm<SignUpFormData>({
    resolver: yupResolver(signupSchema),
  })

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const onSubmit = async (data: SignUpFormData) => {
    const { email, password } = data
    const role = "GUEST"

    try {
      const res = await registerUser(email, password, role)
      dispatch(login({ access_token: res.access_token, role: res.role, userId: res.userId }))
      navigate("/")
    } catch (error) {
      const err = error as AxiosError<{ message: string }>
      toast.error(err.response?.data.message || "Failed to sign up")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center p-4">
      <Card className="w-[40%] max-w-md bg-purple-800/20 border-purple-600/30 backdrop-blur-sm">
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

            <div className="space-y-2">
              <Label htmlFor="password" className="text-purple-200">Password</Label>
              <Input
                id="password"
                type="password"
                {...register("password")}
                className="bg-purple-700/30 border-purple-600/50 text-white placeholder:text-purple-300"
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="text-red-400 text-sm">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-purple-200">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword")}
                className="bg-purple-700/30 border-purple-600/50 text-white placeholder:text-purple-300"
                placeholder="Confirm your password"
              />
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

          <div className="mt-6 text-center">
            <p className="text-purple-200">
              Already have an account?{" "}
              <Link to="guest/login" className="text-amber-400 hover:text-amber-300 font-semibold">
                Sign In
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default SignupPage
