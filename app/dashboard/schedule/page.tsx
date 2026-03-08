"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Smartphone, Battery, Laptop, Monitor, Tablet, ArrowRight, CheckCircle2, MapPin, Calendar, Users } from "lucide-react"

const items = [
  { id: "MOBILE", name: "Mobile Phone", icon: Smartphone, points: 200 },
  { id: "LAPTOP", name: "Laptop", icon: Laptop, points: 500 },
  { id: "BATTERY", name: "Battery", icon: Battery, points: 10 },
  { id: "MONITOR", name: "Monitor", icon: Monitor, points: 300 },
  { id: "TABLET", name: "Tablet", icon: Tablet, points: 250 },
]

export default function SchedulePickup() {
  const [step, setStep] = useState(1)
  const [selectedItem, setSelectedItem] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [address, setAddress] = useState("123 Green Street, Mumbai")
  const [selectedDay, setSelectedDay] = useState("Wednesday")

  const progress = (step / 3) * 100

  return (
    <div className="container py-8 px-6 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-black tracking-tight text-white mb-2">Schedule Pickup</h1>
        <p className="text-gray-400">Join shared pickup in your area</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-12">
        <div className="flex justify-between mb-3">
          <span className="text-sm font-semibold" style={{ color: step >= 1 ? '#2DFF7A' : '#666' }}>
            Select Item
          </span>
          <span className="text-sm font-semibold" style={{ color: step >= 2 ? '#2DFF7A' : '#666' }}>
            Confirm Address
          </span>
          <span className="text-sm font-semibold" style={{ color: step >= 3 ? '#2DFF7A' : '#666' }}>
            Join Shared Pickup
          </span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
          <motion.div 
            className="h-full rounded-full transition-all" 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            style={{ 
              backgroundColor: '#2DFF7A',
              boxShadow: '0 0 20px rgba(45, 255, 122, 0.6)'
            }}
          />
        </div>
      </div>

      {/* Step 1: Select Item */}
      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold text-white mb-6">What would you like to recycle?</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedItem(item.id)}
                className="p-6 rounded-2xl backdrop-blur-md border-2 transition-all hover:scale-105 text-left"
                style={{
                  backgroundColor: selectedItem === item.id ? 'rgba(45, 255, 122, 0.15)' : 'rgba(11, 15, 14, 0.6)',
                  borderColor: selectedItem === item.id ? '#2DFF7A' : 'rgba(45, 255, 122, 0.3)',
                  boxShadow: selectedItem === item.id ? '0 0 30px rgba(45, 255, 122, 0.3)' : 'none'
                }}
              >
                <item.icon className="h-10 w-10 mb-3" style={{ color: selectedItem === item.id ? '#2DFF7A' : '#999' }} />
                <div className="font-bold text-white mb-1">{item.name}</div>
                <div className="text-sm" style={{ color: '#2DFF7A' }}>+{item.points} pts</div>
              </button>
            ))}
          </div>

          <div className="rounded-2xl p-6 backdrop-blur-md border mt-8"
               style={{ 
                 backgroundColor: 'rgba(11, 15, 14, 0.6)', 
                 borderColor: 'rgba(45, 255, 122, 0.3)'
               }}>
            <label className="text-sm font-semibold text-gray-300 mb-3 block">Quantity</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full h-14 rounded-xl px-4 text-lg font-bold transition-all focus:outline-none focus:ring-2"
              style={{ 
                backgroundColor: 'rgba(11, 15, 14, 0.8)', 
                borderColor: 'rgba(45, 255, 122, 0.3)',
                color: 'white',
                border: '1px solid rgba(45, 255, 122, 0.3)'
              }}
            />
          </div>

          <Button
            onClick={() => setStep(2)}
            disabled={!selectedItem}
            className="w-full h-14 font-bold rounded-xl transition-all hover:scale-105 mt-6"
            style={{ 
              backgroundColor: selectedItem ? '#2DFF7A' : '#333', 
              color: selectedItem ? '#0B0F0E' : '#666',
              boxShadow: selectedItem ? '0 0 30px rgba(45, 255, 122, 0.4)' : 'none'
            }}
          >
            Continue <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      )}

      {/* Step 2: Confirm Address */}
      {step === 2 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Confirm your pickup location</h2>
          
          <div className="rounded-2xl p-8 backdrop-blur-md border-2"
               style={{ 
                 backgroundColor: 'rgba(11, 15, 14, 0.6)', 
                 borderColor: '#2DFF7A',
                 boxShadow: '0 0 40px rgba(45, 255, 122, 0.15)'
               }}>
            <div className="flex items-start gap-4 mb-6">
              <MapPin className="h-6 w-6 mt-1" style={{ color: '#2DFF7A' }} />
              <div className="flex-1">
                <label className="text-sm font-semibold text-gray-300 mb-3 block">Pickup Address</label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl px-4 py-3 text-white transition-all focus:outline-none focus:ring-2"
                  style={{ 
                    backgroundColor: 'rgba(11, 15, 14, 0.8)', 
                    border: '1px solid rgba(45, 255, 122, 0.3)'
                  }}
                />
              </div>
            </div>
            
            <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(45, 255, 122, 0.1)' }}>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-5 w-5" style={{ color: '#2DFF7A' }} />
                <span className="font-bold" style={{ color: '#2DFF7A' }}>Pickup-Only Service</span>
              </div>
              <p className="text-sm text-gray-400">We'll collect from your doorstep. No drop-off needed.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={() => setStep(1)}
              variant="outline"
              className="flex-1 h-14 font-bold rounded-xl"
              style={{ 
                borderColor: 'rgba(45, 255, 122, 0.3)',
                backgroundColor: 'rgba(11, 15, 14, 0.6)',
                color: '#2DFF7A'
              }}
            >
              Back
            </Button>
            <Button
              onClick={() => setStep(3)}
              className="flex-1 h-14 font-bold rounded-xl transition-all hover:scale-105"
              style={{ 
                backgroundColor: '#2DFF7A', 
                color: '#0B0F0E',
                boxShadow: '0 0 30px rgba(45, 255, 122, 0.4)'
              }}
            >
              Continue <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </motion.div>
      )}

      {/* Step 3: Join Shared Pickup */}
      {step === 3 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Join shared pickup</h2>
          
          {/* Shared Pickup Visualization */}
          <div className="rounded-2xl p-8 backdrop-blur-md border-2"
               style={{ 
                 backgroundColor: 'rgba(11, 15, 14, 0.6)', 
                 borderColor: '#2DFF7A',
                 boxShadow: '0 0 40px rgba(45, 255, 122, 0.15)'
               }}>
            <div className="flex items-center justify-center gap-6 mb-6">
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-lg flex items-center justify-center border-2"
                    style={{ 
                      borderColor: i <= 3 ? '#2DFF7A' : '#333',
                      backgroundColor: i <= 3 ? 'rgba(45, 255, 122, 0.15)' : 'rgba(51, 51, 51, 0.2)'
                    }}
                  >
                    <Users className="h-5 w-5" style={{ color: i <= 3 ? '#2DFF7A' : '#666' }} />
                  </div>
                ))}
              </div>
            </div>
            
            <div className="text-center mb-6">
              <div className="text-5xl font-black mb-2" style={{ color: '#2DFF7A' }}>3/5</div>
              <p className="text-gray-400">households confirmed in your area</p>
            </div>

            <div className="h-3 rounded-full overflow-hidden mb-6" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
              <div className="h-full rounded-full" 
                   style={{ 
                     width: '60%', 
                     backgroundColor: '#2DFF7A',
                     boxShadow: '0 0 10px rgba(45, 255, 122, 0.5)'
                   }}></div>
            </div>

            <p className="text-center text-sm text-gray-400">
              2 more households needed for optimized shared pickup
            </p>
          </div>

          {/* Weekly Collection Day */}
          <div className="rounded-2xl p-6 backdrop-blur-md border"
               style={{ 
                 backgroundColor: 'rgba(11, 15, 14, 0.6)', 
                 borderColor: 'rgba(45, 255, 122, 0.3)'
               }}>
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-5 w-5" style={{ color: '#2DFF7A' }} />
              <h3 className="text-lg font-bold text-white">Weekly Collection Day</h3>
            </div>
            
            <div className="grid grid-cols-7 gap-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className="py-3 rounded-lg font-bold text-sm transition-all"
                  style={{
                    backgroundColor: selectedDay === day ? 'rgba(45, 255, 122, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                    color: selectedDay === day ? '#2DFF7A' : '#999',
                    border: selectedDay === day ? '2px solid #2DFF7A' : '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={() => setStep(2)}
              variant="outline"
              className="flex-1 h-14 font-bold rounded-xl"
              style={{ 
                borderColor: 'rgba(45, 255, 122, 0.3)',
                backgroundColor: 'rgba(11, 15, 14, 0.6)',
                color: '#2DFF7A'
              }}
            >
              Back
            </Button>
            <Button
              className="flex-1 h-14 font-bold rounded-xl transition-all hover:scale-105"
              style={{ 
                backgroundColor: '#2DFF7A', 
                color: '#0B0F0E',
                boxShadow: '0 0 30px rgba(45, 255, 122, 0.4)'
              }}
            >
              Confirm Pickup <CheckCircle2 className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </motion.div>
      )}

    </div>
  )
}
