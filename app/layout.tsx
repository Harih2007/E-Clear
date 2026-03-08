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
      <body className={cn("min-h-screen font-sans antialiased text-foreground", inter.variable)} style={{ backgroundColor: '#0B0F0E' }}>
        {/* Global Grid Background */}
        <div className="fixed inset-0 z-[-1] pointer-events-none">
          <GridScan
            scanColor="#2DFF7A"
            linesColor="#1a3d2e"
            scanOpacity={0.5}
            gridScale={0.05}
            enableWebcam={false}
            scanOnClick={true}
            enableGyro={false}
            lineThickness={1.5}
            scanGlow={1.2}
            scanSoftness={1.8}
            bloomIntensity={0.5}
            lineJitter={0}
            noiseIntensity={0.02}
            className="w-full h-full opacity-100"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(11,15,14,0.6)_100%)]"></div>
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
