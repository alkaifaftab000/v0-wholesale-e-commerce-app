"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight, ArrowRight, ShieldCheck, Truck, Globe, Star, Award, Users, Zap, MapPin, Phone, Mail, CheckCircle, TrendingUp, Package, Menu, X } from "lucide-react"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

const contactSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  companyName: z.string().optional(),
  phone: z.string().min(10, "Valid phone number required"),
  subject: z.string().min(2, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters")
})

type ContactFormValues = z.infer<typeof contactSchema>

const CounterItem = ({ end, label }: { end: number; label: string }) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let current = 0
    const increment = end / 100
    const timer = setInterval(() => {
      current += increment
      if (current >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, 30)
    return () => clearInterval(timer)
  }, [end])

  return (
    <div className="flex flex-col items-center">
      <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
        {count.toLocaleString()}+
      </div>
      <p className="text-gray-600 font-medium mt-2">{label}</p>
    </div>
  )
}

const TypingAnimation = () => {
  const quotes = [
    "Direct sourcing from verified farmers. Quality assured. Delivered to your doorstep. Grow your business with better margins.",
    "Save up to 30% on procurement costs with our transparent pricing and zero middlemen commissions.",
    "Access thousands of verified suppliers and bulk quantities with flexible payment terms for B2B buyers.",
    "Quality checked at every step with rigorous testing and verification for all products.",
    "Fast delivery across India with real-time tracking and dedicated logistics support for your orders.",
  ]

  const [displayedText, setDisplayedText] = useState("")
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(true)

  useEffect(() => {
    let timer: NodeJS.Timeout
    const currentQuote = quotes[currentQuoteIndex]

    if (isTyping) {
      if (displayedText.length < currentQuote.length) {
        timer = setTimeout(() => {
          setDisplayedText(currentQuote.slice(0, displayedText.length + 1))
        }, 40)
      } else {
        // Text fully typed, wait before deleting
        timer = setTimeout(() => {
          setIsTyping(false)
        }, 3000)
      }
    } else {
      // Deleting
      if (displayedText.length > 0) {
        timer = setTimeout(() => {
          setDisplayedText(displayedText.slice(0, -1))
        }, 20)
      } else {
        // Move to next quote
        setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length)
        setIsTyping(true)
      }
    }

    return () => clearTimeout(timer)
  }, [displayedText, isTyping, currentQuoteIndex, quotes])

  return (
    <div className="text-xl text-gray-600 leading-relaxed min-h-24">
      <span>{displayedText}</span>
      <span className="animate-pulse">|</span>
    </div>
  )
}

const HeroSlideshow = () => {
  const images = [
    "/landing-images/Looking for reliable grains suppliers_.jpg",
    "/landing-images/wheat_warehouse.jpg",
    "/landing-images/rice_flours_pulses_grains.jpg",
    "/landing-images/multigrainin warehouse.jpg",
    "/landing-images/groceriesgrains.jpg",
  ]
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [images.length])

  return (
    <div className="relative w-full aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
      {images.map((src, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <Image
            src={src}
            alt={`Slide ${idx + 1}`}
            fill
            className="object-cover"
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-20"></div>
    </div>
  )
}

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const supabase = createClient()

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema)
  })

  const onSubmitContact = async (data: ContactFormValues) => {
    setIsSubmitting(true)
    try {
      // 1. Try saving to Supabase backup table
      try {
        await supabase.from('contact_inquiries').insert([
          {
            full_name: data.fullName,
            email: data.email,
            company_name: data.companyName,
            phone: data.phone,
            subject: data.subject,
            message: data.message
          }
        ])
      } catch (err) {
        // Allow fallback if table doesn't exist
      }

      // 2. Send via Web3Forms
      const formData = new FormData();
      formData.append("access_key", process.env.NEXT_PUBLIC_WEB3FORMS_KEY || "");
      formData.append("name", data.fullName);
      formData.append("email", data.email);
      formData.append("company", data.companyName || "N/A");
      formData.append("phone", data.phone);
      formData.append("subject", data.subject);
      formData.append("message", data.message);

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const result = await response.json();
      if (result.success) {
        toast.success("Email sent successfully! We'll get back to you soon.");
        reset();
      } else {
        toast.error("Failed to send email. Please try again.");
      }
    } catch (err) {
      toast.error("An error occurred while sending your message.");
    } finally {
      setIsSubmitting(false)
    }
  }

  const whyUsPoints = [
    {
      icon: Award,
      title: "Quality Guaranteed",
      description: "Rigorous quality control and verification at every step of supply chain",
      image: "/landing-images/Indian Pulses.jpg"
    },
    {
      icon: TrendingUp,
      title: "Better Margins",
      description: "Direct sourcing cuts out middlemen, giving you better profit margins",
      image: "/landing-images/grain_variesties.jpg"
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "Reliable logistics network ensures on-time delivery across regions",
      image: "/landing-images/logistics_bytruck.jpg"
    },
    {
      icon: Users,
      title: "Dedicated Support",
      description: "24/7 customer support team ready to help your business grow",
      image: "/landing-images/small_warehouse.jpg"
    },
  ]

  const features = [
    {
      icon: Package,
      title: "Bulk Ordering",
      description: "Order in large quantities with flexible payment terms for B2B businesses",
      image: "/landing-images/warehouse3.jpg"
    },
    {
      icon: Globe,
      title: "Pan-India Reach",
      description: "Supply to every corner of India with efficient distribution network",
      image: "/landing-images/warehouse5.jpg"
    },
    {
      icon: ShieldCheck,
      title: "Verified Suppliers",
      description: "All sellers are verified and authenticated for your peace of mind",
      image: "/landing-images/grains_grocery.jpg"
    },
    {
      icon: TrendingUp,
      title: "Real-time Inventory",
      description: "Live tracking of product availability and pricing information",
      image: "/landing-images/rice_warehouse.jpg"
    },
  ]

  const services = [
    {
      title: "Wholesale Sourcing",
      description: "Direct access to premium grains, pulses, rice and flours from verified farmers",
      image: "/landing-images/Rice_catlogue.jpg"
    },
    {
      title: "Logistics & Delivery",
      description: "End-to-end logistics with real-time tracking and guaranteed delivery",
      image: "/landing-images/warehouse1.jpg"
    },
    {
      title: "Quality Assurance",
      description: "Rigorous testing and quality checks for all products before dispatch",
      image: "/landing-images/typesofgrains.jpg"
    },
    {
      title: "Business Support",
      description: "Expert guidance on sourcing, pricing, and supply chain optimization",
      image: "/landing-images/warehouse.jpg"
    },
  ]

  const brandLogos = [
    "Aashirwad_logo.jpg", "Ashok_logo.jpg", "DC_logo.jpg", "Galaxy_logo.jpg",
    "Jannat_logo.jpg", "KRML_logo.jpg", "Laxmi_logo.jpg", "MangatRam_logo.jpg",
    "Manik_logo.jpg", "Munna_Bhaiya_logo.jpg", "Murliwala__logo.jpg", "Palki_logo.jpg",
    "Panshree_logo.jpg", "Rajdhani_logo.jpg", "Sarbatimoti_logo.jpg", "Scooter_logo.jpg",
    "Sher_Khan_logo.jpg", "Tata_Sampan_logo.jpg", "rishta_logo.jpg", "shiva_logo1.jpg",
    "sujatagold_logo.jpg", "tanatan_logo.jpg"
  ]

  const BrandsCarousel = () => {
    return (
      <section className="py-16 bg-white border-b overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900">Our Trusted Brands & Partners</h2>
          <p className="text-center text-gray-500 mt-3 text-lg">Click on any brand to view exclusive wholesale catalogs</p>
        </div>
        
        {/* Left/Right fading gradients */}
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-white to-transparent z-20 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-white to-transparent z-20 pointer-events-none"></div>
        
        <div className="relative w-full flex overflow-hidden">
          <div className="flex animate-scroll hover:[animation-play-state:paused] w-max items-center py-4">
            {[...brandLogos, ...brandLogos].map((logo, idx) => (
              <Link key={idx} href="/auth/login" className="mx-4 md:mx-8 relative w-32 h-20 md:w-40 md:h-28 flex-shrink-0 transition-transform duration-300 hover:-translate-y-2 filter hover:shadow-xl bg-white rounded-2xl border border-gray-100 flex items-center justify-center group cursor-pointer overflow-hidden">
                <div className="absolute inset-0 bg-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none"></div>
                <div className="relative w-full h-full p-2">
                  <Image src={`/brands/${logo}`} alt={logo.replace('_logo.jpg', '').replace('_', ' ')} fill className="object-contain mix-blend-multiply" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <div className="w-full">
      {/* Navigation */}
      <header className="fixed top-4 left-4 right-4 md:left-6 md:right-6 lg:left-10 lg:right-10 z-50">
        <nav className="bg-white/30 backdrop-blur-xl border border-white/20 rounded-2xl px-4 md:px-6 lg:px-8 py-2 shadow-2xl">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            {/* Logo + Signature */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0 hover:opacity-80 transition">
              <Image
                src="/app_logo.png"
                alt="Shyam Logo"
                width={50}
                height={50}
                className="flex-shrink-0"
              />
              <Image
                src="/signature.png"
                alt="Shyam Signature"
                width={120}
                height={40}
                className="flex-shrink-0"
              />
            </Link>

            {/* Center Navigation - Desktop */}
            <div className="hidden lg:flex items-center gap-0.5">
              <Link href="#home" className="px-3 py-2 text-gray-700 hover:text-orange-600 transition font-medium text-sm hover:bg-white/20 rounded-lg">
                Home
              </Link>
              <Link href="#stats" className="px-3 py-2 text-gray-700 hover:text-orange-600 transition font-medium text-sm hover:bg-white/20 rounded-lg">
                Stats
              </Link>
              <Link href="#why-us" className="px-3 py-2 text-gray-700 hover:text-orange-600 transition font-medium text-sm hover:bg-white/20 rounded-lg">
                Why Us
              </Link>
              <Link href="#features" className="px-3 py-2 text-gray-700 hover:text-orange-600 transition font-medium text-sm hover:bg-white/20 rounded-lg">
                Features
              </Link>
              <Link href="#services" className="px-3 py-2 text-gray-700 hover:text-orange-600 transition font-medium text-sm hover:bg-white/20 rounded-lg">
                Services
              </Link>
              <Link href="#about" className="px-3 py-2 text-gray-700 hover:text-orange-600 transition font-medium text-sm hover:bg-white/20 rounded-lg">
                About Us
              </Link>
              <Link href="#contact" className="px-3 py-2 text-gray-700 hover:text-orange-600 transition font-medium text-sm hover:bg-white/20 rounded-lg">
                Contact
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden flex-shrink-0 p-2 text-gray-700 hover:text-orange-600 transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* CTA Button - Desktop */}
            <div className="hidden lg:flex flex-shrink-0">
              <Button asChild className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl px-5 py-2 text-sm font-semibold shadow-lg">
                <Link href="/auth/login">Get Started</Link>
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 border-t border-white/20 pt-4 space-y-2">
              <Link href="#home" className="block px-3 py-2 text-gray-700 hover:text-orange-600 transition font-medium text-sm hover:bg-white/20 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                Home
              </Link>
              <Link href="#stats" className="block px-3 py-2 text-gray-700 hover:text-orange-600 transition font-medium text-sm hover:bg-white/20 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                Stats
              </Link>
              <Link href="#why-us" className="block px-3 py-2 text-gray-700 hover:text-orange-600 transition font-medium text-sm hover:bg-white/20 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                Why Us
              </Link>
              <Link href="#features" className="block px-3 py-2 text-gray-700 hover:text-orange-600 transition font-medium text-sm hover:bg-white/20 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                Features
              </Link>
              <Link href="#services" className="block px-3 py-2 text-gray-700 hover:text-orange-600 transition font-medium text-sm hover:bg-white/20 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                Services
              </Link>
              <Link href="#about" className="block px-3 py-2 text-gray-700 hover:text-orange-600 transition font-medium text-sm hover:bg-white/20 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                About Us
              </Link>
              <Link href="#contact" className="block px-3 py-2 text-gray-700 hover:text-orange-600 transition font-medium text-sm hover:bg-white/20 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                Contact
              </Link>
              <Button asChild className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl font-semibold shadow-lg mt-2">
                <Link href="/auth/login">Get Started</Link>
              </Button>
            </div>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section id="home" className="pt-40 pb-20 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
        <div className="absolute top-20 right-10 w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-orange-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-block">
                  <span className="px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold">
                    ⭐ Trusted by 500+ Businesses
                  </span>
                </div>
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                  Premium Grains & Pulses at <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">Wholesale Prices</span>
                </h1>
                <TypingAnimation />
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-orange-600 hover:bg-orange-700 text-white shadow-lg">
                  <Link href="/auth/login" className="flex items-center">
                    Get Wholesale Access <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-2 border-gray-300">
                  <Link href="#why-us">Learn More</Link>
                </Button>
              </div>
              <div className="flex items-center gap-8 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Free Registration</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Instant Access</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-b from-orange-400/20 to-transparent rounded-3xl blur-2xl"></div>
              <HeroSlideshow />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section id="stats" className="py-20 bg-white border-b relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <Image src="/landing-images/static_rice.jpg" alt="Background" fill className="object-cover" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <CounterItem end={50} label="Product Categories" />
            <CounterItem end={500} label="Warehouses" />
            <CounterItem end={1000} label="Brands" />
            <CounterItem end={10000} label="Retailers Joined" />
          </div>
        </div>
      </section>

      {/* Brands Carousel Section */}
      <BrandsCarousel />

      {/* Why Us Section */}
      <section id="why-us" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Why Choose ThokWale.Store?</h2>
            <p className="text-xl text-gray-600">Everything you need to build a reliable supply chain</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyUsPoints.map((point, idx) => {
              const Icon = point.icon
              return (
                <Card key={idx} className="border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-2 overflow-hidden">
                  <div className="relative h-48 w-full">
                    <Image src={point.image} alt={point.title} fill className="object-cover object-center" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 p-3 bg-white/90 backdrop-blur-sm rounded-lg">
                      <Icon className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{point.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{point.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Features</h2>
            <p className="text-xl text-gray-600">Everything built for B2B success</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon
              return (
                <div key={idx} className="flex flex-col sm:flex-row gap-6 p-6 border-2 border-gray-100 rounded-2xl hover:border-orange-300 transition bg-white overflow-hidden group">
                  <div className="relative w-full sm:w-1/3 h-48 sm:h-auto rounded-xl overflow-hidden flex-shrink-0">
                     <Image src={feature.image} alt={feature.title} fill className="object-cover object-center group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="flex flex-col justify-center sm:w-2/3">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-orange-100">
                        <Icon className="h-5 w-5 text-orange-600" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">{feature.title}</h3>
                    </div>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-xl text-gray-600">Comprehensive solutions for your wholesale needs</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, idx) => (
              <Card key={idx} className="border shadow-md hover:shadow-lg transition-all group overflow-hidden">
                <div className="relative h-40 w-full overflow-hidden">
                  <Image src={service.image} alt={service.title} fill className="object-cover object-center group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{service.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-sm">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Know Us Section */}
      <section id="about" className="py-20 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Know Us Better</h2>
                <p className="text-lg text-gray-600 leading-relaxed mb-4">
                  ThokWale.Store is a revolutionary B2B marketplace for premium agricultural products. We're building a transparent, efficient wholesale supply chain that connects farmers, suppliers, and retailers directly.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed mb-4">
                  We are currently in the building phase, creating infrastructure to serve thousands of retailers across India with quality grains, pulses, and agricultural products at competitive wholesale prices.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Our mission is to eliminate intermediaries, ensure quality at every step, and help retailers achieve better margins on their procurement. We're committed to transparency, reliability, and customer success.
                </p>
              </div>
              <div className="space-y-4">
                {["Direct Farmer Partnerships", "Transparent Pricing", "Pan-India Reach", "24/7 Customer Support"].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                    <span className="text-lg text-gray-700 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative flex flex-col md:flex-row gap-6 items-center">
              <div className="relative mb-4 md:mb-0 w-full md:w-1/2">
                <Image
                  src="/founder.jpeg"
                  alt="Founder - ThokWale.Store"
                  width={400}
                  height={500}
                  className="rounded-2xl shadow-2xl object-cover"
                />
                <div className="text-center mt-4">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Meet the Founder</h3>
                  <p className="text-gray-600">Building ThokWale.Store to revolutionize wholesale agriculture trade in India</p>
                </div>
              </div>
              <div className="relative w-full md:w-1/2 mt-8 md:mt-16">
                <Image
                  src="/landing-images/ricewarehouse.jpg"
                  alt="Warehouse Operations"
                  width={400}
                  height={400}
                  className="rounded-2xl shadow-xl object-cover border-4 border-white"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 relative bg-gradient-to-b from-gray-50 to-white overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-5 pointer-events-none">
          <Image src="/landing-images/popcorn_grain.jpg" alt="Background" fill className="object-cover" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Get In Touch</h2>
            <p className="text-xl text-gray-600">We'd love to hear from you</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="border shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="inline-block p-4 bg-orange-100 rounded-lg mb-6">
                  <Phone className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Phone</h3>
                <p className="text-gray-600">+91 9876543210</p>
              </CardContent>
            </Card>
            <Card className="border shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="inline-block p-4 bg-orange-100 rounded-lg mb-6">
                  <Mail className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Email</h3>
                <p className="text-gray-600">support@shyamwholesale.com</p>
              </CardContent>
            </Card>
            <Card className="border shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="inline-block p-4 bg-orange-100 rounded-lg mb-6">
                  <MapPin className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Address</h3>
                <p className="text-gray-600">Delhi, India</p>
              </CardContent>
            </Card>
          </div>
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-12 text-center text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Ready to Transform Your Supply Chain?</h3>
            <p className="text-lg mb-8 text-orange-50">Join thousands of businesses already saving 30% on their procurement costs</p>
            <Button asChild size="lg" className="bg-white text-orange-600 hover:bg-orange-50">
              <Link href="/auth/login">
                Get Started Today <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Connect With Us Form Section */}
      <section id="connect" className="py-20 bg-gradient-to-br from-orange-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Connect With Us</h2>
            <p className="text-xl text-gray-600">Send us a message and we'll get back to you within 24 hours</p>
          </div>
          <Card className="border-2 border-orange-200 shadow-xl">
            <CardContent className="p-8 md:p-12">
              <form onSubmit={handleSubmit(onSubmitContact)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input type="text" placeholder="John Doe" className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`} {...register("fullName")} />
                    {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input type="email" placeholder="john@example.com" className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${errors.email ? 'border-red-500' : 'border-gray-300'}`} {...register("email")} />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                  <input type="text" placeholder="Your Company" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" {...register("companyName")} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input type="tel" placeholder="+91 XXXXX XXXXX" className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${errors.phone ? 'border-red-500' : 'border-gray-300'}`} {...register("phone")} />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <input type="text" placeholder="How can we help?" className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${errors.subject ? 'border-red-500' : 'border-gray-300'}`} {...register("subject")} />
                  {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea placeholder="Tell us more about your inquiry..." rows={5} className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none ${errors.message ? 'border-red-500' : 'border-gray-300'}`} {...register("message")}></textarea>
                  {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
                </div>
                <Button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 rounded-lg transition-all">
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-orange-600 rounded-lg">
                  <Image
                    src="/app_logo.png"
                    alt="ThokWale Logo"
                    width={50}
                    height={50}
                    className="flex-shrink-0 rounded-md"
                  />
                </div>
                <Image
                  src="/signature.png"
                  alt="ThokWale Signature"
                  width={120}
                  height={40}
                  className="flex-shrink-0 brightness-0 invert"
                />
              </div>
              <p className="text-sm leading-relaxed">India's leading B2B marketplace for premium agricultural products.</p>
            </div>
            <div>
              <h4 className="text-white font-bold text-lg mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-white transition">About Us</Link></li>
                <li><Link href="#" className="hover:text-white transition">Blog</Link></li>
                <li><Link href="#" className="hover:text-white transition">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold text-lg mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-white transition">Help Center</Link></li>
                <li><Link href="#" className="hover:text-white transition">Contact Us</Link></li>
                <li><Link href="#" className="hover:text-white transition">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold text-lg mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-white transition">Terms & Conditions</Link></li>
                <li><Link href="#" className="hover:text-white transition">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-white transition">Cookies</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2026 ThokWale.Store. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
