"use client";
import { Card, CardTitle } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuTrigger,
    } from "@/components/ui/dropdown-menu";
    
import Link from "next/link"

import { ShoppingCart, Home, Package } from "lucide-react";


interface HeroImageProps {
  src: string;
  alt: string;
}

const HeroImage: React.FC<HeroImageProps> = ({ src, alt }) => {
  return (
    <div>
      <img src={src} alt={alt} style={{ width: "100%", height: "auto" }} />
    </div>
  );
};

// Here's a detailed description for a landing page that you can provide to a professional front-end developer:

// Navigation Bar: The navigation bar should be at the top of the page.
// It should include the following items from left to right:

// Logo: This should be the first item on the left side of the navigation bar.
// Pricing: This should link to a section or page that details the pricing of the product or service.
// Features: This should link to a section or page that describes the features of the product or service.
// Docs: This should link to a section or page that contains documentation or user guides.
// Login: This should be the last item on the right side of the navigation bar. It should link to a login form or page.
// Hero Image: This should be a large, eye-catching image that is placed prominently on the page, typically at the top or in the center. It should be relevant to the product or service and should be designed to attract the attention of visitors.
// Hero Video: This should be a short video that provides an overview or demonstration of the product or service. It should be placed near the Hero Image, and should start playing either on page load or when the user clicks on it.
// Description Cards: These should be a series of cards that provide more detailed information about the product or service. Each card should contain a title, a short description, and possibly an icon or image. The cards should be arranged in a grid or list, and should be easy to scan quickly.
// Footnote: This should be a small section at the bottom of the page that contains additional information or links, such as terms of service, privacy policy, contact information, etc. It should be clearly separated from the rest of the page, typically by a horizontal line or a change in background color.

// Please ensure that the page is responsive, meaning it should look good and be easy to use on all devices, including desktops, tablets, and smartphones. Also, consider accessibility guidelines to ensure the page is usable by people with disabilities.

// use tailwind css for styling

export default function Header() {
  return (
    <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
        <div className="relative ml-auto flex md:grow-0" id="nav-tools">
            <Link
              href="/"
              className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-transparent text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
            >
              {/* <Package2 className="h-4 w-4 transition-all group-hover:scale-110" /> */}
              <img src="/logo.svg" alt="logo" className="w-6 h-6" />
              <span className="sr-only">     Inc</span>
            </Link>
            <Link
              href="/pricing"
              className="flex h-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8"
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="text-lg">Pricing</span>
              <span className="sr-only">Pricing</span>
            </Link>
            <Link
              href="/features"
              className="flex h-9 w-full items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8"
            >
              <Package className="h-5 w-5" />
              <span className="text-lg">Features</span>
              <span className="sr-only">Features</span>
            </Link>
        </div>
      </header>
    </div>
  );
}
