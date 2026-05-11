"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { ArrowLeft, Mail, Lock, User, Phone, Calendar, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import confetti from "canvas-confetti"

const signUpSchema = z.object({
  username: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().regex(/^\d{10}$/, "Phone number must be exactly 10 digits").optional().or(z.literal('')),
  dob: z.string().min(1, "Date of birth is required").refine((dateString) => {
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age >= 18;
  }, "You must be at least 18 years old to register"),
  gender: z.string().min(1, "Please select a gender"),
  businessType: z.string().min(1, "Please select a business type"),
  password: z.string().regex(
    /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9]).{8,}$/, 
    "Password must be 8+ characters, with 1 uppercase, 1 number, and 1 special character"
  ),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
})

type SignUpFormValues = z.infer<typeof signUpSchema>

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      phone: "",
      dob: "",
      gender: "",
      businessType: "",
      password: "",
      confirmPassword: ""
    }
  })

  // Watch for select values to integrate with Shadcn Select component
  const genderValue = watch("gender")
  const businessTypeValue = watch("businessType")

  const onSubmit = async (data: SignUpFormValues) => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            username: data.username,
            phone: data.phone,
            dob: data.dob,
            gender: data.gender,
            business_type: data.businessType,
          }
        }
      })
      if (error) {
        toast.error("Failed to sign up. " + error.message)
      } else {
        // Trigger Success UI and Confetti!
        setIsSuccess(true)
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f97316', '#fb923c', '#fdba74', '#10b981', '#ffffff']
        })
      }
    } catch (err) {
      toast.error("An error occurred during sign up.")
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
      toast.error("Google login failed.")
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
      {/* Background blobs */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob pointer-events-none"></div>
      <div className="fixed bottom-0 left-0 w-96 h-96 bg-orange-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000 pointer-events-none"></div>

      {/* Left side: Form */}
      <div className="w-full lg:w-[55%] flex items-center justify-center p-4 sm:p-8 relative z-10 overflow-y-auto max-h-screen">
        <div className="w-full max-w-xl py-8">
          <div className="mb-6">
            <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-orange-600 transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </div>

          {!isSuccess ? (
            <Card className="border-0 shadow-2xl rounded-3xl bg-white/90 backdrop-blur-xl">
              <CardHeader className="space-y-1 text-center pb-4 border-b border-gray-100">
                <CardTitle className="text-2xl font-bold text-gray-900">Create an Account</CardTitle>
                <CardDescription className="text-gray-500 text-base">
                  Join thousands of retailers on ThokWale.Store
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-6">
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <Button type="button" variant="outline" className="h-12 border-gray-200 bg-white hover:bg-gray-50 rounded-xl shadow-sm transition-all" onClick={handleGoogleLogin}>
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                  </Button>
                  <Button type="button" variant="outline" className="h-12 border-gray-200 bg-white hover:bg-gray-50 rounded-xl shadow-sm transition-all" onClick={handleMetaLogin}>
                    <svg className="h-5 w-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </Button>
                  <Button type="button" variant="outline" className="h-12 border-gray-200 bg-white hover:bg-gray-50 rounded-xl shadow-sm transition-all" onClick={handleMicrosoftLogin}>
                    <svg className="h-5 w-5" viewBox="0 0 21 21">
                      <rect x="1" y="1" width="9" height="9" fill="#f25022"/>
                      <rect x="1" y="11" width="9" height="9" fill="#00a4ef"/>
                      <rect x="11" y="1" width="9" height="9" fill="#7fba00"/>
                      <rect x="11" y="11" width="9" height="9" fill="#ffb900"/>
                    </svg>
                  </Button>
                </div>

                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-4 text-gray-500 font-bold tracking-wider rounded-full border border-gray-100 shadow-sm py-1">Or register with email</span>
                  </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="username" className="text-gray-700 font-medium">Full Name / Username</Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-4 w-4 text-gray-400" />
                        </div>
                        <Input id="username" placeholder="John Doe" className={`pl-10 bg-white/50 border-gray-200 focus-visible:ring-orange-500 rounded-xl hover:border-orange-300 transition-colors ${errors.username ? 'border-red-500 focus-visible:ring-red-500' : ''}`} {...register("username")} />
                      </div>
                      {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-700 font-medium">Email Address</Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-4 w-4 text-gray-400" />
                        </div>
                        <Input id="email" type="email" placeholder="name@example.com" className={`pl-10 bg-white/50 border-gray-200 focus-visible:ring-orange-500 rounded-xl hover:border-orange-300 transition-colors ${errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}`} {...register("email")} />
                      </div>
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-gray-700 font-medium">Phone Number <span className="text-gray-400 font-normal">(Optional)</span></Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="h-4 w-4 text-gray-400" />
                        </div>
                        <Input id="phone" type="tel" placeholder="10 digit number" className={`pl-10 bg-white/50 border-gray-200 focus-visible:ring-orange-500 rounded-xl hover:border-orange-300 transition-colors ${errors.phone ? 'border-red-500 focus-visible:ring-red-500' : ''}`} {...register("phone")} />
                      </div>
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dob" className="text-gray-700 font-medium">Date of Birth</Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Calendar className="h-4 w-4 text-gray-400" />
                        </div>
                        <Input id="dob" type="date" className={`pl-10 bg-white/50 border-gray-200 focus-visible:ring-orange-500 rounded-xl text-gray-700 hover:border-orange-300 transition-colors ${errors.dob ? 'border-red-500 focus-visible:ring-red-500' : ''}`} {...register("dob")} />
                      </div>
                      {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob.message}</p>}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="gender" className="text-gray-700 font-medium">Gender</Label>
                      <Select onValueChange={(val) => setValue('gender', val, { shouldValidate: true })} value={genderValue}>
                        <SelectTrigger className={`bg-white/50 border-gray-200 focus:ring-orange-500 rounded-xl hover:border-orange-300 transition-colors ${errors.gender ? 'border-red-500 focus:ring-red-500' : ''}`}>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                          <SelectItem value="prefer-not">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="businessType" className="text-gray-700 font-medium">Business Type</Label>
                      <Select onValueChange={(val) => setValue('businessType', val, { shouldValidate: true })} value={businessTypeValue}>
                        <SelectTrigger className={`bg-white/50 border-gray-200 focus:ring-orange-500 rounded-xl hover:border-orange-300 transition-colors ${errors.businessType ? 'border-red-500 focus:ring-red-500' : ''}`}>
                          <SelectValue placeholder="Select business role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="retailer">Retailer</SelectItem>
                          <SelectItem value="wholesaler">Wholesaler</SelectItem>
                          <SelectItem value="farmer">Farmer / Supplier</SelectItem>
                          <SelectItem value="distributor">Distributor</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.businessType && <p className="text-red-500 text-xs mt-1">{errors.businessType.message}</p>}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2 pt-1">
                      <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-4 w-4 text-gray-400" />
                        </div>
                        <Input id="password" type="password" placeholder="Create a secure password" className={`pl-10 bg-white/50 border-gray-200 focus-visible:ring-orange-500 rounded-xl hover:border-orange-300 transition-colors ${errors.password ? 'border-red-500 focus-visible:ring-red-500' : ''}`} {...register("password")} />
                      </div>
                      {errors.password && <p className="text-red-500 text-xs mt-1 leading-tight">{errors.password.message}</p>}
                    </div>

                    <div className="space-y-2 pt-1">
                      <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">Confirm Password</Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-4 w-4 text-gray-400" />
                        </div>
                        <Input id="confirmPassword" type="password" placeholder="Repeat your password" className={`pl-10 bg-white/50 border-gray-200 focus-visible:ring-orange-500 rounded-xl hover:border-orange-300 transition-colors ${errors.confirmPassword ? 'border-red-500 focus-visible:ring-red-500' : ''}`} {...register("confirmPassword")} />
                      </div>
                      {errors.confirmPassword && <p className="text-red-500 text-xs mt-1 leading-tight">{errors.confirmPassword.message}</p>}
                    </div>
                  </div>

                  <Button type="submit" className="w-full mt-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-6 rounded-xl shadow-lg transition-all" disabled={isLoading}>
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>

                <p className="text-center text-xs text-gray-500 mt-4">
                  By registering, you agree to our <Link href="#" className="underline hover:text-orange-600">Terms of Service</Link> and <Link href="#" className="underline hover:text-orange-600">Privacy Policy</Link>.
                </p>
              </CardContent>
              <CardFooter className="flex justify-center border-t border-gray-100 pt-5 pb-5 bg-gray-50/80 rounded-b-3xl">
                <div className="text-sm text-gray-600 font-medium">
                  Already have an account?{" "}
                  <Link href="/auth/login" className="text-orange-600 font-bold hover:text-orange-700 hover:underline">
                    Sign in
                  </Link>
                </div>
              </CardFooter>
            </Card>
          ) : (
            // SUCCESS UI STATE
            <div className="w-full animate-in fade-in zoom-in duration-500">
              <Card className="border-0 shadow-2xl rounded-3xl bg-white/90 backdrop-blur-xl overflow-hidden">
                <div className="bg-orange-50 p-8 flex justify-center items-center border-b border-orange-100">
                  <div className="bg-orange-100 p-4 rounded-full relative">
                    <div className="absolute inset-0 bg-orange-400/20 rounded-full animate-ping"></div>
                    <CheckCircle2 className="w-16 h-16 text-orange-500 relative z-10" />
                  </div>
                </div>
                <CardContent className="pt-8 pb-6 text-center px-8">
                  <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Registration Successful!</h2>
                  <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                    We're thrilled to have you! We've sent a verification email to your inbox. Please click the link inside it to activate your account.
                  </p>
                  
                  <div className="rounded-2xl overflow-hidden mb-8 shadow-md border border-gray-100 relative h-48 w-full">
                    <Image 
                      src="/landing-images/grains_grocery.jpg" 
                      alt="Grains grocery"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                       <span className="text-white font-medium">Welcome to the future of B2B Wholesale</span>
                    </div>
                  </div>

                  <Link href="/auth/login">
                    <Button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-6 rounded-xl shadow-lg transition-all text-lg">
                      Go to Login
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Right side: Image */}
      <div className="hidden lg:flex lg:w-[45%] relative bg-orange-600 items-center justify-center p-12">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-500/80 to-orange-800/90 mix-blend-multiply z-10" />
        <Image 
          src="/landing-images/multigrainin warehouse.jpg" 
          alt="Wholesale Grains" 
          fill 
          className="object-cover object-center opacity-80"
        />
        <div className="relative z-20 text-white max-w-lg">
          <div className="flex items-center gap-4 mb-8">
            <Image src="/app_logo.png" alt="Logo" width={64} height={64} className="rounded-xl shadow-lg bg-white p-1" />
            <span className="font-bold text-2xl tracking-tight">ThokWale.Store</span>
          </div>
          <h2 className="text-4xl font-bold mb-6 leading-tight">Join India's fastest-growing B2B agriculture network.</h2>
          <ul className="space-y-4 mb-8 text-orange-100">
            <li className="flex items-center gap-3">
              <div className="p-1 bg-white/20 rounded-full"><div className="w-2 h-2 bg-white rounded-full"></div></div>
              Access to thousands of verified products
            </li>
            <li className="flex items-center gap-3">
              <div className="p-1 bg-white/20 rounded-full"><div className="w-2 h-2 bg-white rounded-full"></div></div>
              Direct pricing without middleman fees
            </li>
            <li className="flex items-center gap-3">
              <div className="p-1 bg-white/20 rounded-full"><div className="w-2 h-2 bg-white rounded-full"></div></div>
              End-to-end logistics and tracking
            </li>
          </ul>
        </div>
      </div>

    </div>
  )
}
