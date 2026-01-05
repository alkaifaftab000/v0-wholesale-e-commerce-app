"use client"

import Link from "next/link"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, CheckCircle2, Building2, FileText } from "lucide-react"

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(true) // Set initial loading to true
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const supabase = createClient()

  const [formData, setFormData] = useState({
    business_name: "",
    business_type: "",
    vat_number: "",
    address: "",
    phone: "",
  })

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth/login")
        return
      }
      setUser(user)

      const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

      if (profile) {
        if (profile.registration_status === "verified") {
          router.push("/dashboard")
          return
        }
        if (profile.registration_status === "pending") {
          setStep(3)
          setFormData({
            business_name: profile.business_name || "",
            business_type: profile.business_type || "",
            vat_number: profile.vat_number || "",
            address: profile.address || "",
            phone: profile.phone || "",
          })
        }
      } else {
        setFormData((prev) => ({
          ...prev,
          business_name: user.user_metadata?.business_name || "",
        }))
      }
      setIsLoading(false)
    }
    checkUser()
  }, [supabase, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, business_type: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        ...formData,
        registration_status: "pending",
        updated_at: new Date().toISOString(),
      })

      if (error) throw error

      setStep(3)
    } catch (error: any) {
      console.error("[v0] Error updating profile:", error.message)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30 py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="flex justify-between items-center px-4">
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step >= 1 ? "bg-primary text-primary-foreground border-primary" : "bg-background text-muted-foreground border-muted"}`}
            >
              <Building2 className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-1 font-medium">Business</span>
          </div>
          <div className={`flex-1 h-0.5 mx-2 ${step >= 2 ? "bg-primary" : "bg-muted"}`} />
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step >= 2 ? "bg-primary text-primary-foreground border-primary" : "bg-background text-muted-foreground border-muted"}`}
            >
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-1 font-medium">Documents</span>
          </div>
          <div className={`flex-1 h-0.5 mx-2 ${step >= 3 ? "bg-primary" : "bg-muted"}`} />
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step >= 3 ? "bg-primary text-primary-foreground border-primary" : "bg-background text-muted-foreground border-muted"}`}
            >
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-1 font-medium">Review</span>
          </div>
        </div>

        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Business Details</CardTitle>
              <CardDescription>Tell us about your company to unlock wholesale pricing.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="business_name">Legal Business Name</Label>
                <Input
                  id="business_name"
                  name="business_name"
                  value={formData.business_name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="business_type">Business Type</Label>
                <Select onValueChange={handleSelectChange} value={formData.business_type}>
                  <SelectTrigger id="business_type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="retailer">Retailer</SelectItem>
                    <SelectItem value="wholesaler">Wholesaler</SelectItem>
                    <SelectItem value="manufacturer">Manufacturer</SelectItem>
                    <SelectItem value="restaurant">Restaurant / Catering</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="vat_number">VAT / Tax Identification Number</Label>
                <Input
                  id="vat_number"
                  name="vat_number"
                  placeholder="e.g. GB123456789"
                  value={formData.vat_number}
                  onChange={handleInputChange}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={() => setStep(2)}
                disabled={!formData.business_name || !formData.business_type}
              >
                Continue to Address
              </Button>
            </CardFooter>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Contact & Address</CardTitle>
              <CardDescription>Where should we deliver your wholesale orders?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="phone">Business Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Registered Business Address</Label>
                <Textarea
                  id="address"
                  name="address"
                  placeholder="Full address, city, state, postal code"
                  rows={4}
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>
            </CardContent>
            <CardFooter className="flex gap-4">
              <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button className="flex-1" onClick={handleSubmit} disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Application
              </Button>
            </CardFooter>
          </Card>
        )}

        {step === 3 && (
          <Card className="text-center py-8">
            <CardHeader>
              <div className="flex justify-center mb-4 text-primary">
                <CheckCircle2 className="w-16 h-16" />
              </div>
              <CardTitle className="text-2xl">Application Submitted</CardTitle>
              <CardDescription>
                Thank you for applying, {formData.business_name}. Our compliance team is reviewing your details.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-primary/5 p-4 rounded-lg border border-primary/20 text-sm text-left">
                <h4 className="font-bold mb-2 flex items-center">
                  <FileText className="w-4 h-4 mr-2" /> What happens next?
                </h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Review process usually takes 24-48 hours</li>
                  <li>We may reach out via {user.email} for document verification</li>
                  <li>Once verified, you will receive full access to our catalog and pricing</li>
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/">Return to Home</Link>
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  )
}
