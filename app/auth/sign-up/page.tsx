"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [businessName, setBusinessName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo:
            process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/auth/callback`,
          data: {
            business_name: businessName,
            registration_status: "pending",
          },
        },
      })

      if (error) throw error
      setIsSuccess(true)
    } catch (err: any) {
      setError(err.message || "Failed to create account")
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
        <Card className="w-full max-w-md shadow-lg text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
            </div>
            <CardTitle className="text-2xl">Application Received</CardTitle>
            <CardDescription>
              We've sent a verification link to <strong>{email}</strong>.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Please verify your email to continue with your business registration. Our team will review your
              application once your profile is complete.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/auth/login">Return to Login</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDF8F6] p-4 font-sans">
      <Card className="w-full max-w-md shadow-sm border-none bg-white p-6">
        <CardHeader className="space-y-1 pb-6">
          <div className="flex justify-center mb-6">
            <Link href="/" className="text-3xl font-bold text-[#6F4E37] tracking-tight">
              Shyam Wholesale Solutions
            </Link>
          </div>
          <CardTitle className="text-3xl font-semibold text-center text-[#2D1B14]">Register Business</CardTitle>
          <CardDescription className="text-center text-[#8C786F] text-base mt-2">
            Apply for a wholesale account to access B2B pricing
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSignUp}>
          <CardContent className="space-y-5 px-0">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="businessName" className="text-sm font-semibold text-[#2D1B14]">
                Business Name
              </Label>
              <Input
                id="businessName"
                placeholder="Global Foods Ltd."
                required
                className="h-12 border-[#E5D5D0] rounded-lg focus:ring-[#6F4E37] focus:border-[#6F4E37]"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-[#2D1B14]">
                Work Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="procurement@business.com"
                required
                className="h-12 border-[#E5D5D0] rounded-lg focus:ring-[#6F4E37] focus:border-[#6F4E37]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold text-[#2D1B14]">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                required
                className="h-12 border-[#E5D5D0] rounded-lg focus:ring-[#6F4E37] focus:border-[#6F4E37]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
              <p className="text-[11px] text-[#8C786F] italic">
                Min. 8 characters with at least one number and special character.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-6 px-0 pt-4">
            <Button
              type="submit"
              className="w-full h-12 bg-[#6F4E37] hover:bg-[#5D402E] text-white font-bold text-lg rounded-xl transition-all"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Account
            </Button>
            <div className="text-center text-base text-[#8C786F]">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-[#6F4E37] font-bold hover:underline">
                Sign In
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
