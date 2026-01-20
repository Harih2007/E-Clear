import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/lib/auth-context";
import { GridScan } from "@/components/ui/GridScan";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "E-Clear | Smart E-Waste Disposal",
  description: "Revolutionizing electronic waste management through incentivized micro-pickups.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn("min-h-screen bg-black font-sans antialiased text-foreground", inter.variable)}>
        {/* Global Grid Background */}
        <div className="fixed inset-0 z-[-1] pointer-events-none">
          <GridScan
            scanColor="#34d399" // Emerald 400
            linesColor="#022c22" // Emerald 950
            scanOpacity={0.2}
            gridScale={0.06}
            enableWebcam={false} // Disable webcam globally for performance, enable mainly on Home if needed
            scanOnClick={true}
            enableGyro={true}
            className="w-full h-full opacity-60"
          />
          {/* Dark Vignette Global */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_100%)] opacity-80"></div>
        </div>

        <AuthProvider>
          <Navbar />
          <main className="min-h-screen pt-16 relative z-10">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
