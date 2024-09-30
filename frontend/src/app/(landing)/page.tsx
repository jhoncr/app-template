'use client';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Zap, Shield, Globe } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">

      <main className="flex-1">
        <LandingHero />
        {/* Hero Video */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
              See Our Product in Action
            </h2>
            <div className="aspect-video mx-auto max-w-3xl rounded-xl overflow-hidden">
              <video
                controls
                className="w-full h-full object-cover"
                poster="/placeholder.svg?height=400&width=800"
              >
                <source src="/placeholder-video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </section>

        {/* Description Cards */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
              Our Features
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-col items-center">
                  <div className="p-2 bg-primary-100 rounded-full mb-2">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Fast Performance</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p>
                    Lightning-fast load times and smooth interactions for the
                    best user experience.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-col items-center">
                  <div className="p-2 bg-primary-100 rounded-full mb-2">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Secure</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p>
                    Top-notch security measures to keep your data safe and
                    protected.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-col items-center">
                  <div className="p-2 bg-primary-100 rounded-full mb-2">
                    <Globe className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Global Reach</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p>
                    Expand your business globally with our international support
                    and features.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-col items-center">
                  <div className="p-2 bg-primary-100 rounded-full mb-2">
                    <Play className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Easy to Use</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p>
                    Intuitive interface and user-friendly features for seamless
                    operation.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t">
        <div className="container flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            © 2023 ACME Inc. All rights reserved.
          </p>
          <nav className="sm:ml-auto flex gap-4 sm:gap-6">
            <Link
              className="text-xs hover:underline underline-offset-4"
              href="#"
            >
              Terms of Service
            </Link>
            <Link
              className="text-xs hover:underline underline-offset-4"
              href="#"
            >
              Privacy
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}

function LandingHero() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <img
            alt="Hero"
            className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
            height="310"
            src="/logo.svg?height=310&width=550"
            width="550"
          />
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Welcome to ACME Inc.
              </h1>
              <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                We provide cutting-edge solutions for your business needs.
                Discover how we can help you grow.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
            <Link href="/u">
                <Button size="lg">Get Started</Button>
            </Link>
            <Link href="/about">
                <Button size="lg" variant="outline">
                    Learn More
                </Button>
            </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
