import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Users, Target, Heart } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  About ACME Inc.
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Discover our story, mission, and the people behind our success.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Company History */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">Our Journey</h2>
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <img
                alt="ACME Inc. office"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
                height="310"
                src="/placeholder.svg?height=310&width=550"
                width="550"
              />
              <div className="flex flex-col justify-center space-y-4">
                <p className="text-gray-500 dark:text-gray-400">
                  Founded in 2010, ACME Inc. started as a small startup with a big vision. Over the years, we've grown into a leading technology company, serving clients worldwide. Our journey has been marked by innovation, perseverance, and a commitment to excellence.
                </p>
                <p className="text-gray-500 dark:text-gray-400">
                  Today, we're proud to be at the forefront of technological advancements, constantly pushing the boundaries of what's possible. Our team of dedicated professionals continues to drive our success, ensuring that we remain a trusted partner for businesses across the globe.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Our Mission</h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  To empower businesses with innovative technology solutions, enabling them to thrive in the digital age. We strive to create value for our clients, foster a culture of continuous learning, and contribute positively to the global tech ecosystem.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Members */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">Our Team</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { name: "Jane Doe", role: "CEO & Founder", image: "/placeholder.svg?height=200&width=200" },
                { name: "John Smith", role: "CTO", image: "/placeholder.svg?height=200&width=200" },
                { name: "Emily Johnson", role: "Head of Design", image: "/placeholder.svg?height=200&width=200" },
              ].map((member, index) => (
                <Card key={index}>
                  <CardHeader className="flex flex-col items-center">
                    <img
                      alt={member.name}
                      className="aspect-square overflow-hidden rounded-full object-cover object-center"
                      height="200"
                      src={member.image}
                      width="200"
                    />
                    <CardTitle className="mt-4">{member.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-gray-500 dark:text-gray-400">{member.role}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Company Values */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">Our Values</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-col items-center">
                  <div className="p-2 bg-primary-100 rounded-full mb-2">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Innovation</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p>We constantly seek new ideas and solutions to stay ahead in the fast-paced tech world.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-col items-center">
                  <div className="p-2 bg-primary-100 rounded-full mb-2">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Collaboration</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p>We believe in the power of teamwork and fostering strong partnerships with our clients.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-col items-center">
                  <div className="p-2 bg-primary-100 rounded-full mb-2">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Excellence</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p>We strive for the highest standards in everything we do, from code to customer service.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-col items-center">
                  <div className="p-2 bg-primary-100 rounded-full mb-2">
                    <Heart className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Integrity</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p>We conduct our business with honesty, transparency, and respect for all stakeholders.</p>
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