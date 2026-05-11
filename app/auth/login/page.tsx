"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { ArrowLeft, Mail, Lock } from "lucide-react"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

const loginSchema = z.object({
  identifier: z.string().min(1, "Email or phone number is required"),
  password: z.string().min(1, "Password is required")
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: ""
    }
  })

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true)
    try {
      // Check if identifier looks like an email or a phone number
      const isEmail = data.identifier.includes("@")
      const credentials = isEmail 
        ? { email: data.identifier, password: data.password } 
        : { phone: data.identifier, password: data.password }

      const { error } = await supabase.auth.signInWithPassword(credentials)
      if (error) {
        toast.error("Failed to sign in. Please check your credentials.")
      } else {
        toast.success("Successfully signed in!")
        window.location.href = "/dashboard"
      }
    } catch (err) {
      toast.error("An error occurred during sign in.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
    } catch (err) {
      toast.error("Google login failed. Please configure Supabase.")
    }
  }

  const handleMetaLogin = async () => {
    toast.info("Meta login coming soon")
  }

  const handleMicrosoftLogin = async () => {
    toast.info("Microsoft login coming soon")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-gray-100 flex flex-col lg:flex-row relative overflow-hidden">
      {/* Background blobs for matching theme */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000 pointer-events-none"></div>

      {/* Left side: Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-orange-600 items-center justify-center p-12">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-500/80 to-orange-800/90 mix-blend-multiply z-10" />
        <Image 
          src="/landing-images/groceriesgrains.jpg" 
          alt="Wholesale Grains" 
          fill 
          className="object-cover object-center opacity-80"
        />
        <div className="relative z-20 text-white max-w-lg">
          <Link href="/" className="inline-flex items-center text-orange-200 hover:text-white transition-colors mb-12">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold mb-6 leading-tight">Your gateway to premium wholesale products.</h1>
          <p className="text-lg text-orange-100 leading-relaxed mb-8">
            Connect directly with verified suppliers, secure better margins, and manage your bulk orders efficiently on a single platform.
          </p>
          <div className="flex items-center gap-4">
            <Image src="/app_logo.png" alt="Logo" width={64} height={64} className="rounded-xl shadow-lg bg-white p-1" />
            <span className="font-bold text-2xl tracking-tight">ThokWale.Store</span>
          </div>
        </div>
      </div>

      {/* Right side: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative z-10">
        <div className="w-full max-w-md">
          <Link href="/" className="lg:hidden inline-flex items-center text-sm font-medium text-gray-500 hover:text-orange-600 transition-colors mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>

          <Card className="border-0 shadow-2xl rounded-3xl bg-white/90 backdrop-blur-xl">
            <CardHeader className="space-y-1 text-center pb-6 border-b border-gray-100">
              <CardTitle className="text-3xl font-bold text-gray-900">Welcome Back</CardTitle>
              <CardDescription className="text-gray-500 text-base">
                Sign in to your wholesale account
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="identifier" className="text-gray-700 font-medium">Email or Phone Number</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input 
                      id="identifier" 
                      placeholder="name@example.com or +91 9876543210" 
                      type="text"
                      className={`pl-10 py-6 bg-white/50 border-gray-200 focus-visible:ring-orange-500 rounded-xl transition-all shadow-sm hover:border-orange-300 ${errors.identifier ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                      {...register("identifier")}
                    />
                  </div>
                  {errors.identifier && <p className="text-red-500 text-xs mt-1">{errors.identifier.message}</p>}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                    <Link href="/auth/forgot-password" className="text-sm font-semibold text-orange-600 hover:text-orange-700 hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="••••••••"
                      className={`pl-10 py-6 bg-white/50 border-gray-200 focus-visible:ring-orange-500 rounded-xl transition-all shadow-sm hover:border-orange-300 ${errors.password ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                      {...register("password")}
                    />
                  </div>
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                </div>
                <Button type="submit" className="w-full mt-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-6 rounded-xl shadow-lg hover:shadow-xl transition-all" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-4 text-gray-500 font-bold tracking-wider rounded-full border border-gray-100 shadow-sm py-1">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <Button type="button" variant="outline" className="h-14 border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 rounded-xl shadow-sm transition-all" onClick={handleGoogleLogin}>
                  <svg className="h-6 w-6" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                </Button>
                <Button type="button" variant="outline" className="h-14 border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 rounded-xl shadow-sm transition-all" onClick={handleMetaLogin}>
                  <svg className="h-6 w-6 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </Button>
                <Button type="button" variant="outline" className="h-14 border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 rounded-xl shadow-sm transition-all" onClick={handleMicrosoftLogin}>
                  <svg className="h-6 w-6" viewBox="0 0 21 21">
                    <rect x="1" y="1" width="9" height="9" fill="#f25022"/>
                    <rect x="1" y="11" width="9" height="9" fill="#00a4ef"/>
                    <rect x="11" y="1" width="9" height="9" fill="#7fba00"/>
                    <rect x="11" y="11" width="9" height="9" fill="#ffb900"/>
                  </svg>
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center border-t border-gray-100 pt-6 pb-6 bg-gray-50/80 rounded-b-3xl">
              <div className="text-base text-gray-600">
                Don't have an account?{" "}
                <Link href="/auth/sign-up" className="font-bold text-orange-600 hover:text-orange-700 hover:underline">
                  Sign up for free
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
