"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { MapPin } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-col h-screen overflow-hidden px-0">

      {/* Hero Section / Main Slide */}
      {/* Background is handled by layout.tsx (Global Grid) */}
      <section className="relative w-full h-full flex items-center justify-center overflow-hidden bg-transparent">

        <div className="container max-w-screen-xl mx-auto px-4 relative z-10 h-full flex flex-col items-center justify-center text-center pointer-events-none">

          {/* Main Content Card - Dark Liquid Glass */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="pointer-events-auto flex flex-col gap-8 items-center max-w-5xl bg-black/40 backdrop-blur-[20px] p-12 md:p-16 rounded-[3rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] ring-1 ring-white/5 relative overflow-hidden"
            style={{
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7), inset 0 0 0 1px rgba(255,255,255,0.05)"
            }}
          >
            {/* Liquid Shine Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-50 pointer-events-none"></div>

            <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-bold transition-all border-emerald-500/30 bg-emerald-950/30 text-emerald-400 w-fit shadow-[0_0_15px_rgba(52,211,153,0.3)] hover:bg-emerald-950/50">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              India's #1 E-Waste Solution
            </div>

            <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-white leading-[1] drop-shadow-2xl z-10">
              Turn Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-emerald-300 via-teal-200 to-cyan-300 filter drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]">
                E-Waste
              </span> <br />
              Into <span className="bg-gradient-to-r from-emerald-400 to-green-500 text-transparent bg-clip-text">Rewards.</span>
            </h1>

            <p className="text-xl md:text-2xl text-neutral-200 leading-relaxed font-light max-w-2xl drop-shadow-md">
              India generates <strong>3.2 Million Tonnes</strong> of e-waste annually.
              Join the movement to recycle responsibly and earn eco-credits.
            </p>

            <div className="flex flex-wrap gap-6 pt-4 justify-center">
              <Button size="lg" className="h-16 rounded-full px-10 text-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all hover:scale-105 border-0 font-semibold">
                <Link href="/dashboard/user">Start Recycling</Link>
              </Button>
              <Button variant="outline" size="lg" className="h-16 rounded-full px-10 text-xl border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/40 transition-all backdrop-blur-xl hover:scale-105">
                Drop-off Locations <MapPin className="ml-2 h-5 w-5" />
              </Button>
            </div>

            {/* Mini Stats Row */}
            <div className="flex gap-12 pt-8 border-t border-white/10 mt-4 px-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">50k+</div>
                <div className="text-sm text-neutral-400 uppercase tracking-widest font-medium">Recycled</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">100+</div>
                <div className="text-sm text-neutral-400 uppercase tracking-widest font-medium">Partners</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">3.2M</div>
                <div className="text-sm text-neutral-400 uppercase tracking-widest font-medium">Tonnes/Yr</div>
              </div>
            </div>
          </motion.div>

        </div>
      </section>
    </div>
  )
}
