import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap, Shield, Globe, BarChart, Clock, Users } from 'lucide-react'

export default function FeaturesPage() {
  return (
    <div className="flex flex-col min-h-screen">

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Powerful Features for Your Success
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Discover the tools and capabilities that set our application apart and drive your business forward.
                </p>
              </div>
              <div className="space-x-4">
                <Button asChild>
                  <Link href="/pricing">Get Started</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/docs">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Main Features Grid */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
              Key Features
            </h2>
            <div className="grid gap-6 lg:grid-cols-3">
              <FeatureCard
                icon={<Zap className="h-10 w-10 text-primary" />}
                title="Lightning Fast Performance"
                description="Experience unparalleled speed and efficiency with our optimized application architecture."
              />
              <FeatureCard
                icon={<Shield className="h-10 w-10 text-primary" />}
                title="Bank-Grade Security"
                description="Rest easy knowing your data is protected by state-of-the-art security measures and encryption."
              />
              <FeatureCard
                icon={<Globe className="h-10 w-10 text-primary" />}
                title="Global Accessibility"
                description="Access your account and data from anywhere in the world, at any time."
              />
              <FeatureCard
                icon={<BarChart className="h-10 w-10 text-primary" />}
                title="Advanced Analytics"
                description="Gain valuable insights with our powerful analytics tools and customizable dashboards."
              />
              <FeatureCard
                icon={<Clock className="h-10 w-10 text-primary" />}
                title="Automated Workflows"
                description="Streamline your processes with intelligent automation and time-saving features."
              />
              <FeatureCard
                icon={<Users className="h-10 w-10 text-primary" />}
                title="Seamless Collaboration"
                description="Work together effortlessly with robust team collaboration tools and real-time updates."
              />
            </div>
          </div>
        </section>

        {/* Feature Spotlight */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Spotlight: Advanced Analytics
                </h2>
                <p className="text-gray-500 dark:text-gray-400 md:text-xl">
                  Our advanced analytics feature provides deep insights into your data, helping you make informed decisions and drive your business forward.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    Real-time data processing
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    Customizable dashboards
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    Predictive analysis
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    Export and share reports
                  </li>
                </ul>
                <Button asChild>
                  <Link href="/docs#analytics">Learn More About Analytics</Link>
                </Button>
              </div>
              <div className="lg:order-first">
                <img
                  alt="Analytics Dashboard"
                  className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center"
                  height="310"
                  src="/placeholder.svg?height=310&width=550"
                  width="550"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Testimonial */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <blockquote className="mx-auto max-w-2xl text-center">
              <p className="font-semibold text-xl md:text-2xl mb-4">
                "This application has transformed the way we do business. The advanced analytics and collaboration features have increased our productivity tenfold."
              </p>
              <footer className="text-sm text-gray-500 dark:text-gray-400">
                Jane Doe, CEO of TechCorp
              </footer>
            </blockquote>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to Get Started?
                </h2>
                <p className="mx-auto max-w-[600px] text-primary-foreground/80 md:text-xl">
                  Join thousands of satisfied users and take your business to the next level with our powerful features.
                </p>
              </div>
              <div className="space-x-4">
                <Button asChild variant="secondary">
                  <Link href="/pricing">View Pricing</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/contact">Contact Sales</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t">
        <div className="container flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6">
          <p className="text-xs text-gray-500 dark:text-gray-400">© 2023 ACME Inc. All rights reserved.</p>
          <nav className="sm:ml-auto flex gap-4 sm:gap-6">
            <Link className="text-xs hover:underline underline-offset-4" href="#">
              Terms of Service
            </Link>
            <Link className="text-xs hover:underline underline-offset-4" href="#">
              Privacy
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <Card className="flex flex-col items-center text-center">
      <CardHeader>
        <div className="p-2 bg-primary-100 rounded-full mb-2">{icon}</div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  )
}

function Check(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}