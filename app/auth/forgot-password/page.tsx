"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { ArrowLeft, Mail, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
})

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: ""
    }
  })

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/auth/update-password`,
      })
      if (error) {
        toast.error("Failed to send reset email. " + error.message)
      } else {
        setIsSuccess(true)
        toast.success("Password reset email sent!")
      }
    } catch (err) {
      toast.error("An error occurred.")
    } finally {
      setIsLoading(false)
    }
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
          src="/landing-images/popcorn_grain.jpg" 
          alt="Wholesale Grains" 
          fill 
          className="object-cover object-center opacity-80"
        />
        <div className="relative z-20 text-white max-w-lg">
          <Link href="/" className="inline-flex items-center text-orange-200 hover:text-white transition-colors mb-12">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold mb-6 leading-tight">Secure your wholesale account.</h1>
          <p className="text-lg text-orange-100 leading-relaxed mb-8">
            Reset your password quickly and get back to sourcing premium products for your business.
          </p>
          <div className="flex items-center gap-4">
            <Image src="/app_logo.png" alt="Logo" width={64} height={64} className="rounded-xl shadow-lg bg-white p-1" />
            <span className="font-bold text-2xl tracking-tight">ThokWale.Store</span>
          </div>
        </div>
      </div>

      {/* Right side: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative z-10">
        <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
          <Link href="/auth/login" className="lg:hidden inline-flex items-center text-sm font-medium text-gray-500 hover:text-orange-600 transition-colors mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Login
          </Link>

          {!isSuccess ? (
            <Card className="border-0 shadow-2xl rounded-3xl bg-white/90 backdrop-blur-xl">
              <CardHeader className="space-y-1 text-center pb-6 border-b border-gray-100">
                <CardTitle className="text-3xl font-bold text-gray-900">Forgot Password</CardTitle>
                <CardDescription className="text-gray-500 text-base">
                  Enter your email address to receive a secure reset link
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700 font-medium">Email Address</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input 
                        id="email" 
                        placeholder="name@example.com" 
                        type="email"
                        className={`pl-10 py-6 bg-white/50 border-gray-200 focus-visible:ring-orange-500 rounded-xl transition-all shadow-sm hover:border-orange-300 ${errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                        {...register("email")}
                      />
                    </div>
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                  </div>
                  
                  <Button type="submit" className="w-full mt-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-6 rounded-xl shadow-lg hover:shadow-xl transition-all" disabled={isLoading}>
                    {isLoading ? "Sending Link..." : "Send Reset Link"}
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="flex justify-center border-t border-gray-100 pt-6 pb-6 bg-gray-50/80 rounded-b-3xl">
                <div className="text-base text-gray-600">
                  Remember your password?{" "}
                  <Link href="/auth/login" className="font-bold text-orange-600 hover:text-orange-700 hover:underline">
                    Back to Login
                  </Link>
                </div>
              </CardFooter>
            </Card>
          ) : (
            <Card className="border-0 shadow-2xl rounded-3xl bg-white/90 backdrop-blur-xl overflow-hidden text-center">
              <div className="bg-orange-50 p-8 flex justify-center items-center border-b border-orange-100">
                <div className="bg-orange-100 p-4 rounded-full relative">
                  <div className="absolute inset-0 bg-orange-400/20 rounded-full animate-ping"></div>
                  <CheckCircle2 className="w-16 h-16 text-orange-500 relative z-10" />
                </div>
              </div>
              <CardContent className="pt-8 pb-8 px-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Reset Link Sent!</h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                  We've sent a secure password reset link to your email inbox. Please check your spam folder if you don't see it within a few minutes.
                </p>
                <Link href="/auth/login">
                  <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-6 rounded-xl shadow-md transition-all text-base">
                    Return to Login
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
