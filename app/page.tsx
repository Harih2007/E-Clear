"use client"

import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/modal"
import { motion } from "framer-motion"
import { Smartphone, Truck, Users, Leaf, ArrowRight, CheckCircle2, MapPin, Calendar, Award } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function Home() {
  const [showHowItWorks, setShowHowItWorks] = useState(false)

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden px-6 py-20">
        <div className="container max-w-7xl mx-auto relative z-10">
          
          {/* Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border mb-8 backdrop-blur-sm transition-all hover:scale-105" 
                 style={{ borderColor: '#2DFF7A', backgroundColor: 'rgba(45, 255, 122, 0.1)' }}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: '#2DFF7A' }}></span>
                <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: '#2DFF7A' }}></span>
              </span>
              <span className="text-sm font-bold tracking-wide" style={{ color: '#2DFF7A' }}>PICKUP-ONLY SERVICE</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black tracking-tight text-white mb-8 leading-[1.1]">
              Safe E-Waste Pickup.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r" style={{ 
                backgroundImage: 'linear-gradient(to right, #2DFF7A, #1dd65f)' 
              }}>
                Right From Your Doorstep.
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed font-light">
              Join neighbors in your area for shared micro-pickups. <br />
              <span style={{ color: '#2DFF7A' }} className="font-semibold">Lower costs. Lower emissions. Higher impact.</span>
            </p>

            <div className="flex flex-wrap gap-5 justify-center">
              <Link href="/dashboard/user">
                <div className="flex h-16 w-max px-10 text-lg font-bold rounded-xl transition-all hover:scale-105 border-0 shadow-2xl group items-center justify-center cursor-pointer" 
                        style={{ 
                          backgroundColor: '#2DFF7A', 
                          color: '#0B0F0E',
                          boxShadow: '0 0 40px rgba(45, 255, 122, 0.4)'
                        }}>
                  Schedule Pickup
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={() => setShowHowItWorks(true)}
                className="h-16 px-10 text-lg font-semibold rounded-xl backdrop-blur-sm transition-all hover:scale-105" 
                style={{ 
                  borderColor: '#2DFF7A', 
                  backgroundColor: 'rgba(45, 255, 122, 0.05)',
                  color: '#2DFF7A'
                }}>
                How It Works
              </Button>
            </div>
          </motion.div>

          {/* Shared Pickup Visualization */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-4xl mx-auto mb-20"
          >
            <div className="rounded-2xl p-10 backdrop-blur-md border-2 transition-all hover:border-opacity-80" 
                 style={{ 
                   backgroundColor: 'rgba(11, 15, 14, 0.6)', 
                   borderColor: '#2DFF7A',
                   boxShadow: '0 0 60px rgba(45, 255, 122, 0.15)'
                 }}>
              <div className="flex items-center justify-center gap-8">
                <div className="flex gap-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.4 + i * 0.1 }}
                      className="w-12 h-12 rounded-xl flex items-center justify-center border-2 backdrop-blur-sm"
                      style={{ 
                        borderColor: i <= 3 ? '#2DFF7A' : '#333',
                        backgroundColor: i <= 3 ? 'rgba(45, 255, 122, 0.15)' : 'rgba(51, 51, 51, 0.2)'
                      }}
                    >
                      <Users className="h-6 w-6" style={{ color: i <= 3 ? '#2DFF7A' : '#666' }} />
                    </motion.div>
                  ))}
                </div>
                <ArrowRight className="h-8 w-8" style={{ color: '#2DFF7A' }} />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.9 }}
                  className="w-16 h-16 rounded-xl flex items-center justify-center border-2"
                  style={{ 
                    borderColor: '#2DFF7A',
                    backgroundColor: 'rgba(45, 255, 122, 0.2)',
                    boxShadow: '0 0 30px rgba(45, 255, 122, 0.3)'
                  }}
                >
                  <Truck className="h-8 w-8" style={{ color: '#2DFF7A' }} />
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto"
          >
            {[
              { icon: Smartphone, title: "We Accept", desc: "Phones, laptops, batteries, chargers, and small electronics" },
              { icon: Leaf, title: "Eco-Friendly", desc: "Certified recycling partners. Zero landfill. Full transparency." },
              { icon: CheckCircle2, title: "Earn Incentives", desc: "Get rewards for every pickup. Track your environmental impact." }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="rounded-2xl p-8 backdrop-blur-md border transition-all hover:scale-105 group"
                style={{ 
                  backgroundColor: 'rgba(11, 15, 14, 0.4)', 
                  borderColor: 'rgba(45, 255, 122, 0.3)',
                  boxShadow: '0 0 30px rgba(45, 255, 122, 0.1)'
                }}
              >
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-all group-hover:scale-110" 
                     style={{ backgroundColor: 'rgba(45, 255, 122, 0.15)' }}>
                  <feature.icon className="h-7 w-7" style={{ color: '#2DFF7A' }} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </section>

      {/* How It Works Modal */}
      <Modal isOpen={showHowItWorks} onClose={() => setShowHowItWorks(false)} title="">
        <div className="space-y-8 -mt-4">
          
          {/* Header */}
          <div className="text-center pb-6 border-b border-emerald-100">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-black mb-2" style={{ color: '#2DFF7A' }}>
                How E-Clear Works
              </h2>
              <p className="text-gray-600">Your journey to sustainable e-waste disposal</p>
            </motion.div>
          </div>

          {/* Steps with Animations */}
          <div className="space-y-6">
            
            {/* Step 1 */}
            <motion.div 
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="flex gap-4 p-4 rounded-xl hover:bg-emerald-50 transition-all group"
            >
              <div className="flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform" 
                   style={{ backgroundColor: '#2DFF7A' }}>
                <Smartphone className="h-7 w-7 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">STEP 1</span>
                  <h3 className="font-bold text-lg text-gray-900">Request Pickup</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Schedule a pickup for your e-waste in seconds. Select items like phones, laptops, batteries, and enter your location.
                </p>
              </div>
            </motion.div>

            {/* Step 2 - Pooling (Highlighted) */}
            <motion.div 
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="relative p-5 rounded-xl border-2 shadow-lg"
              style={{ 
                backgroundColor: 'rgba(45, 255, 122, 0.05)',
                borderColor: '#2DFF7A'
              }}
            >
              <div className="absolute -top-3 left-4 px-3 py-1 rounded-full text-xs font-bold bg-white border-2"
                   style={{ borderColor: '#2DFF7A', color: '#2DFF7A' }}>
                ⚡ SMART POOLING
              </div>
              <div className="flex gap-4 mt-2">
                <div className="flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center shadow-lg" 
                     style={{ backgroundColor: '#2DFF7A' }}>
                  <Users className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">STEP 2</span>
                    <h3 className="font-bold text-lg text-gray-900">Join Your Neighbors</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    Your request is automatically pooled with nearby households. Watch real-time progress:
                  </p>
                  
                  {/* Pooling Animation */}
                  <div className="flex items-center gap-3 mb-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                        className="w-10 h-10 rounded-lg flex items-center justify-center border-2"
                        style={{ 
                          borderColor: i <= 3 ? '#2DFF7A' : '#ddd',
                          backgroundColor: i <= 3 ? 'rgba(45, 255, 122, 0.2)' : '#f5f5f5'
                        }}
                      >
                        <Users className="h-5 w-5" style={{ color: i <= 3 ? '#2DFF7A' : '#999' }} />
                      </motion.div>
                    ))}
                    <span className="font-bold text-lg" style={{ color: '#2DFF7A' }}>3/5</span>
                  </div>

                  <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(45, 255, 122, 0.15)' }}>
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle2 className="h-4 w-4" style={{ color: '#2DFF7A' }} />
                      <span className="text-sm font-bold" style={{ color: '#2DFF7A' }}>60% Lower Costs</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Leaf className="h-4 w-4" style={{ color: '#2DFF7A' }} />
                      <span className="text-sm font-bold" style={{ color: '#2DFF7A' }}>Lower Carbon Emissions</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Step 3 */}
            <motion.div 
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="flex gap-4 p-4 rounded-xl hover:bg-emerald-50 transition-all group"
            >
              <div className="flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform" 
                   style={{ backgroundColor: '#2DFF7A' }}>
                <MapPin className="h-7 w-7 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">STEP 3</span>
                  <h3 className="font-bold text-lg text-gray-900">E-Centre Accepts</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  The nearest verified recycling center reviews and accepts your pooled request. All centers are licensed and certified.
                </p>
              </div>
            </motion.div>

            {/* Step 4 */}
            <motion.div 
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="flex gap-4 p-4 rounded-xl hover:bg-emerald-50 transition-all group"
            >
              <div className="flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform" 
                   style={{ backgroundColor: '#2DFF7A' }}>
                <Calendar className="h-7 w-7 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">STEP 4</span>
                  <h3 className="font-bold text-lg text-gray-900">Pickup Scheduled</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  E-Centre schedules a convenient pickup date and time window. You'll receive instant notifications with all details.
                </p>
              </div>
            </motion.div>

            {/* Step 5 */}
            <motion.div 
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1.0, duration: 0.5 }}
              className="flex gap-4 p-4 rounded-xl hover:bg-emerald-50 transition-all group"
            >
              <div className="flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform" 
                   style={{ backgroundColor: '#2DFF7A' }}>
                <Truck className="h-7 w-7 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">STEP 5</span>
                  <h3 className="font-bold text-lg text-gray-900">Doorstep Collection</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  E-Centre collects e-waste from your doorstep. <span className="font-semibold text-gray-900">No travel, no hassle!</span> Just hand it over and you're done.
                </p>
              </div>
            </motion.div>

            {/* Step 6 - Rewards (Highlighted) */}
            <motion.div 
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.5 }}
              className="relative p-5 rounded-xl border-2 shadow-lg"
              style={{ 
                background: 'linear-gradient(135deg, rgba(45, 255, 122, 0.1) 0%, rgba(29, 214, 95, 0.1) 100%)',
                borderColor: '#2DFF7A'
              }}
            >
              <div className="absolute -top-3 left-4 px-3 py-1 rounded-full text-xs font-bold bg-white border-2"
                   style={{ borderColor: '#2DFF7A', color: '#2DFF7A' }}>
                🎁 REWARDS
              </div>
              <div className="flex gap-4 mt-2">
                <div className="flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center shadow-lg" 
                     style={{ backgroundColor: '#2DFF7A' }}>
                  <Award className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">STEP 6</span>
                    <h3 className="font-bold text-lg text-gray-900">Earn Eco-Points</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    Receive eco-points instantly based on items recycled. Redeem for rewards or donate to environmental causes!
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 p-3 rounded-lg text-center" style={{ backgroundColor: 'rgba(45, 255, 122, 0.2)' }}>
                      <div className="text-2xl font-black" style={{ color: '#2DFF7A' }}>₹50-200</div>
                      <div className="text-xs text-gray-600 font-semibold">Per Pickup</div>
                    </div>
                    <div className="flex-1 p-3 rounded-lg text-center" style={{ backgroundColor: 'rgba(45, 255, 122, 0.2)' }}>
                      <div className="text-2xl font-black" style={{ color: '#2DFF7A' }}>100%</div>
                      <div className="text-xs text-gray-600 font-semibold">Safe Disposal</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>

          {/* CTA */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.3, duration: 0.5 }}
            className="pt-6 border-t border-emerald-100"
          >
            <Link href="/auth/register">
              <div 
                className="w-full flex items-center justify-center h-14 font-bold rounded-xl transition-all hover:scale-105 shadow-lg text-lg group cursor-pointer" 
                style={{ 
                  backgroundColor: '#2DFF7A', 
                  color: '#0B0F0E',
                  boxShadow: '0 0 30px rgba(45, 255, 122, 0.3)'
                }}>
                Start Your First Pickup
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
            <p className="text-center text-xs text-gray-500 mt-3">
              Join 1000+ households making a difference
            </p>
          </motion.div>

        </div>
      </Modal>
    </div>
  )
}
