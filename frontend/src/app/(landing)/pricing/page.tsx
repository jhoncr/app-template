'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, X } from 'lucide-react'

export default function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('monthly')

  const handleSelectPlan = (plan: 'monthly' | 'annual') => {
    setSelectedPlan(plan)
  }

  return (
    <div className="flex flex-col min-h-screen">

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Simple, Transparent Pricing
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Choose the plan that's right for you and start enjoying our services today.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Plans */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:gap-12 items-stretch">
              {/* Monthly Plan */}
              <Card 
                className={`flex flex-col cursor-pointer transition-all duration-300 ${
                  selectedPlan === 'monthly' ? 'border-primary ring-2 ring-primary' : ''
                }`}
                onClick={() => handleSelectPlan('monthly')}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleSelectPlan('monthly')
                  }
                }}
                role="radio"
                aria-checked={selectedPlan === 'monthly'}
              >
                <CardHeader>
                  <CardTitle>Monthly Plan</CardTitle>
                  <CardDescription>Perfect for short-term projects</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="text-4xl font-bold">$5/month</div>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-green-500" />
                      Full access to all features
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-green-500" />
                      24/7 customer support
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-green-500" />
                      Regular updates
                    </li>
                    <li className="flex items-center">
                      <X className="mr-2 h-4 w-4 text-red-500" />
                      No long-term commitment
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant={selectedPlan === 'monthly' ? 'default' : 'outline'}>
                    Choose Monthly Plan
                  </Button>
                </CardFooter>
              </Card>

              {/* Annual Plan */}
              <Card 
                className={`flex flex-col cursor-pointer transition-all duration-300 ${
                  selectedPlan === 'annual' ? 'border-primary ring-2 ring-primary' : ''
                }`}
                onClick={() => handleSelectPlan('annual')}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleSelectPlan('annual')
                  }
                }}
                role="radio"
                aria-checked={selectedPlan === 'annual'}
              >
                <CardHeader>
                  <CardTitle>Annual Plan</CardTitle>
                  <CardDescription>Best value for long-term users</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="text-4xl font-bold">$50/year</div>
                  <div className="text-sm text-muted-foreground">Save $10 compared to monthly</div>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-green-500" />
                      All features from Monthly Plan
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-green-500" />
                      Priority customer support
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-green-500" />
                      Early access to new features
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-green-500" />
                      16% discount applied
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant={selectedPlan === 'annual' ? 'default' : 'outline'}>
                    Choose Annual Plan
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
              Frequently Asked Questions
            </h2>
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <Card>
                <CardHeader>
                  <CardTitle>Can I switch between plans?</CardTitle>
                </CardHeader>
                <CardContent>
                  Yes, you can switch between monthly and annual plans at any time. If you switch from annual to monthly, the change will take effect at the end of your current billing cycle.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Is there a free trial?</CardTitle>
                </CardHeader>
                <CardContent>
                  We offer a 14-day free trial for new users. You can explore all features during this period before deciding on a plan.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>What payment methods do you accept?</CardTitle>
                </CardHeader>
                <CardContent>
                  We accept all major credit cards, PayPal, and bank transfers for annual plans.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Is there a refund policy?</CardTitle>
                </CardHeader>
                <CardContent>
                  We offer a 30-day money-back guarantee for annual plans. Monthly plans can be canceled at any time, but we do not provide refunds for partial months.
                </CardContent>
              </Card>
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