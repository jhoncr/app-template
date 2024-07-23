import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthUserProvider } from "@/lib/auth_handler";


const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "Template App with Next.js + Firebase",
//   description: "Nextjs bundle is static and deployedo on firebase hosting as SPA",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TooltipProvider>
          <AuthUserProvider>
            {children}
          </AuthUserProvider>

        </TooltipProvider>  
        </body>
    </html>
  );
}
