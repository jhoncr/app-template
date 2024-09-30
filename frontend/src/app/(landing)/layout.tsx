
'use client'
import Link from "next/link";
import { UserNav } from "@/components/ui/user-nav";
import { useAuth } from "@/lib/auth_handler";
import { Button } from "@/components/ui/button";


export default function LandingLayout( { children }: { children: React.ReactNode }) {
  
    return (
      <>
       <LandingHeader />
         {children}
      </>
    );
  }

function LandingHeader() {
    const { authUser, loading, signOut } = useAuth();

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container px-4 md:px-6 flex h-14 items-center justify-between">
            <Link className="mr-6 flex items-center space-x-2" href="/">
                <img
                alt="Logo"
                className="h-8 w-auto"
                src="/logo.svg"
                />
                <span className="hidden font-bold sm:inline-block">ACME Inc.</span>
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium">
                <Link href="/pricing">Pricing</Link>
                <Link href="/features">Features</Link>
                <Link href="/about">About</Link>
            </nav>
            
            <div className="flex items-center justify-between space-x-2 md:justify-end">

            { authUser && <UserNav user={authUser} signOut={signOut} /> ||

            <Button variant="outline" asChild>
                <Link href="/u">Login</Link>
            </Button>
    }
            </div>
        </div>
        </header>
    );
}