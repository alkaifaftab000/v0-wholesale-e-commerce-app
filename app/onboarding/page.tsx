"use client"

import Link from "next/link"
import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle2, Building2, FileText } from "lucide-react"

export default function OnboardingPage() {
  const [step, setStep] = useState(1)

  const [formData, setFormData] = useState({
    business_name: "",
    business_type: "",
    gst_number: "",
    fssai_number: "",
    address: "",
    phone: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, business_type: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStep(3)
  }

  return (
    <div className="min-h-screen bg-[#FDF8F6] py-12 px-4">
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
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-[#2D1B14]">Business Registration - Get Wholesale Access</CardTitle>
              <CardDescription className="text-[#8C786F]">
                Tell us about your company to unlock B2B pricing.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="business_name" className="font-semibold text-[#2D1B14]">
                  Legal Business Name
                </Label>
                <Input
                  id="business_name"
                  name="business_name"
                  className="border-[#E5D5D0]"
                  value={formData.business_name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="business_type" className="font-semibold text-[#2D1B14]">
                  Business Type
                </Label>
                <Select onValueChange={handleSelectChange} value={formData.business_type}>
                  <SelectTrigger id="business_type" className="border-[#E5D5D0]">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="retailer">Retailer</SelectItem>
                    <SelectItem value="wholesaler">Wholesaler</SelectItem>
                    <SelectItem value="manufacturer">Manufacturer</SelectItem>
                    <SelectItem value="restaurant">Restaurant / Catering</SelectItem>
                    <SelectItem value="hotel">Hotel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="gst_number" className="font-semibold text-[#2D1B14]">
                    GST Number (15 digits)
                  </Label>
                  <Input
                    id="gst_number"
                    name="gst_number"
                    placeholder="27AAAAA0000A1Z5"
                    maxLength={15}
                    className="border-[#E5D5D0]"
                    value={formData.gst_number}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="fssai_number" className="font-semibold text-[#2D1B14]">
                    FSSAI Number (14 digits)
                  </Label>
                  <Input
                    id="fssai_number"
                    name="fssai_number"
                    placeholder="12345678901234"
                    maxLength={14}
                    className="border-[#E5D5D0]"
                    value={formData.fssai_number}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-[#6F4E37] hover:bg-[#5D402E] text-white font-bold h-12 rounded-xl"
                onClick={() => setStep(2)}
                disabled={!formData.business_name || !formData.business_type}
              >
                Continue to Verification
              </Button>
            </CardFooter>
          </Card>
        )}

        {step === 2 && (
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-[#2D1B14]">Contact & Verification</CardTitle>
              <CardDescription className="text-[#8C786F]">
                Upload documents and provide your business contact details.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="phone" className="font-semibold text-[#2D1B14]">
                  Phone Number (Indian Format)
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">+91</span>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="9876543210"
                    maxLength={10}
                    className="pl-12 border-[#E5D5D0]"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address" className="font-semibold text-[#2D1B14]">
                  Registered Business Address
                </Label>
                <Textarea
                  id="address"
                  name="address"
                  placeholder="Full address, city, state, postal code"
                  rows={3}
                  className="border-[#E5D5D0]"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label className="font-semibold text-[#2D1B14]">Important Documents (GST/FSSAI Certificate)</Label>
                <div className="border-2 border-dashed border-[#E5D5D0] rounded-xl p-6 text-center hover:bg-white transition-colors cursor-pointer">
                  <input type="file" className="hidden" id="doc-upload" multiple accept=".pdf,.jpg,.png" />
                  <Label htmlFor="doc-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center">
                      <FileText className="w-10 h-10 text-[#6F4E37] mb-2" />
                      <span className="text-sm font-medium text-[#2D1B14]">Click to upload or drag and drop</span>
                      <span className="text-xs text-[#8C786F] mt-1">PDF, JPG, PNG (Max 5MB each)</span>
                    </div>
                  </Label>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex gap-4">
              <Button
                variant="outline"
                className="flex-1 bg-transparent border-[#E5D5D0] text-[#6F4E37] h-12 rounded-xl"
                onClick={() => setStep(1)}
              >
                Back
              </Button>
              <Button
                className="flex-1 bg-[#6F4E37] hover:bg-[#5D402E] text-white font-bold h-12 rounded-xl"
                onClick={handleSubmit}
              >
                Submit Verification
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
                  <li>We will contact you via email for document verification</li>
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
