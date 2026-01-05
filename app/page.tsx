import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight, ArrowRight, ShieldCheck, Truck, Globe } from "lucide-react"

export default function LandingPage() {
  const categories = [
    {
      name: "Grains",
      description: "Premium wheat, corn, and barley sourced from top-tier growers.",
      image: "/golden-wheat-fields-macro.jpg",
    },
    {
      name: "Pulses",
      description: "High-protein lentils, chickpeas, and beans for bulk distribution.",
      image: "/assorted-dried-lentils-and-beans.jpg",
    },
    {
      name: "Rice",
      description: "Basmati, Jasmine, and long-grain varieties for wholesale.",
      image: "/white-basmati-rice-grains.jpg",
    },
    {
      name: "Flours",
      description: "Stone-ground and industrially milled flours for bakeries.",
      image: "/fresh-white-flour-scoop.jpg",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-background/95 backdrop-blur sticky top-0 z-50">
        <Link className="flex items-center justify-center" href="/">
          <span className="font-bold text-2xl tracking-tight text-primary">Shyam Wholesale Solutions</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="#categories">
            Categories
          </Link>
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="/auth/login">
            Sign In
          </Link>
          <Button asChild size="sm">
            <Link href="/auth/sign-up">Register Business</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px] items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-balance">
                    Global Wholesale Supply for Grains & Pulses
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl text-pretty">
                    Direct sourcing, verified quality, and seamless logistics for your B2B supply chain needs.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg" className="px-8">
                    <Link href="/auth/sign-up">
                      Get Wholesale Access <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" className="px-8 bg-transparent">
                    Learn More
                  </Button>
                </div>
              </div>
              <Image
                src="/wholesale-grain-silos-and-distribution.jpg"
                alt="Grain Distribution"
                width={800}
                height={600}
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last border shadow-sm"
                priority
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="p-4 bg-primary/10 rounded-full">
                  <ShieldCheck className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Quality Assured</h3>
                <p className="text-muted-foreground">
                  Every batch is tested and certified to meet international food safety standards.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="p-4 bg-primary/10 rounded-full">
                  <Truck className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Reliable Logistics</h3>
                <p className="text-muted-foreground">
                  End-to-end tracking and guaranteed delivery schedules across the globe.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="p-4 bg-primary/10 rounded-full">
                  <Globe className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Direct Sourcing</h3>
                <p className="text-muted-foreground">
                  Bypassing middle-men to provide competitive wholesale pricing directly from source.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section id="categories" className="w-full py-12 md:py-24 lg:py-32 bg-muted/20">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Wholesale Product Range</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Register your business to view live pricing and inventory across our core categories.
                </p>
              </div>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {categories.map((category) => (
                <Card
                  key={category.name}
                  className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow"
                >
                  <Image
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    width={600}
                    height={400}
                    className="aspect-square object-cover"
                  />
                  <CardContent className="p-6">
                    <h3 className="font-bold text-xl mb-2">{category.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
                    <Link
                      href="/auth/login"
                      className="text-sm font-semibold text-primary flex items-center hover:underline"
                    >
                      View Inventory <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 border-t">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Ready to Secure Your Supply Chain?</h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mx-auto">
                  Join hundreds of verified businesses sourcing premium grains and pulses directly from Shyam Wholesale
                  Solutions.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <Button asChild className="w-full" size="lg">
                  <Link href="/auth/sign-up">Apply for Wholesale Account</Link>
                </Button>
                <p className="text-xs text-muted-foreground">
                  Verification typically takes 24-48 hours. Business documents required.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-background">
        <p className="text-xs text-muted-foreground">© 2026 Shyam Wholesale Solutions. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy Policy
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Contact Sales
          </Link>
        </nav>
      </footer>
    </div>
  )
}
