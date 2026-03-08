"use client"

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { User, Building2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
    return (
        <div className="flex items-center justify-center min-h-screen p-6" style={{ backgroundColor: '#0B0F0E' }}>
            <div className="w-full max-w-2xl">
                
                {/* Logo/Title */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-black text-white mb-3">E-Clear</h1>
                    <p className="text-xl text-gray-400">Choose your login type</p>
                </div>

                {/* Role Selection Cards */}
                <div className="grid md:grid-cols-2 gap-6">
                    
                    {/* User Login */}
                    <Link href="/auth/login-user">
                        <motion.div
                            whileHover={{ 
                                scale: 1.02,
                                boxShadow: '0 0 60px rgba(45, 255, 122, 0.3)',
                                borderColor: 'rgba(45, 255, 122, 0.5)'
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 20
                            }}
                            className="rounded-2xl p-8 backdrop-blur-md border-2 cursor-pointer transition-all flex flex-col"
                            style={{ 
                                backgroundColor: 'rgba(11, 15, 14, 0.6)', 
                                borderColor: 'rgba(45, 255, 122, 0.3)',
                                boxShadow: '0 0 40px rgba(45, 255, 122, 0.1)',
                                minHeight: '340px',
                                height: '340px'
                            }}>
                            <div className="flex flex-col items-center text-center flex-1 justify-between">
                                <div className="w-20 h-20 rounded-2xl flex items-center justify-center"
                                     style={{ backgroundColor: 'rgba(45, 255, 122, 0.15)' }}>
                                    <User className="h-10 w-10" style={{ color: '#2DFF7A' }} />
                                </div>
                                <div className="flex-1 flex flex-col justify-center py-4">
                                    <h2 className="text-2xl font-bold text-white mb-2">User Login</h2>
                                    <p className="text-gray-400 text-sm h-10 flex items-center justify-center">
                                        Schedule e-waste pickups and earn rewards
                                    </p>
                                </div>
                                <div 
                                    className="w-full h-12 font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                                    style={{ 
                                        backgroundColor: '#2DFF7A', 
                                        color: '#0B0F0E'
                                    }}>
                                    Login as User
                                    <ArrowRight className="h-5 w-5" />
                                </div>
                            </div>
                        </motion.div>
                    </Link>

                    {/* E-Centre Login */}
                    <Link href="/auth/login-ecentre">
                        <motion.div
                            whileHover={{ 
                                scale: 1.02,
                                boxShadow: '0 0 60px rgba(45, 255, 122, 0.3)',
                                borderColor: 'rgba(45, 255, 122, 0.5)'
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 20
                            }}
                            className="rounded-2xl p-8 backdrop-blur-md border-2 cursor-pointer transition-all flex flex-col"
                            style={{ 
                                backgroundColor: 'rgba(11, 15, 14, 0.6)', 
                                borderColor: 'rgba(45, 255, 122, 0.3)',
                                boxShadow: '0 0 40px rgba(45, 255, 122, 0.1)',
                                minHeight: '340px',
                                height: '340px'
                            }}>
                            <div className="flex flex-col items-center text-center flex-1 justify-between">
                                <div className="w-20 h-20 rounded-2xl flex items-center justify-center"
                                     style={{ backgroundColor: 'rgba(45, 255, 122, 0.15)' }}>
                                    <Building2 className="h-10 w-10" style={{ color: '#2DFF7A' }} />
                                </div>
                                <div className="flex-1 flex flex-col justify-center py-4">
                                    <h2 className="text-2xl font-bold text-white mb-2">E-Centre Login</h2>
                                    <p className="text-gray-400 text-sm h-10 flex items-center justify-center">
                                        Manage pickups and recycling operations
                                    </p>
                                </div>
                                <div 
                                    className="w-full h-12 font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                                    style={{ 
                                        backgroundColor: '#2DFF7A', 
                                        color: '#0B0F0E'
                                    }}>
                                    Login as E-Centre
                                    <ArrowRight className="h-5 w-5" />
                                </div>
                            </div>
                        </motion.div>
                    </Link>
                </div>

                {/* Sign Up Link */}
                <div className="text-center mt-8">
                    <p className="text-gray-400 text-sm">
                        Don't have an account?{" "}
                        <Link href="/auth/register" className="font-bold hover:underline" style={{ color: '#2DFF7A' }}>
                            Sign up as User
                        </Link>
                        {" or "}
                        <Link href="/auth/register-ecentre" className="font-bold hover:underline" style={{ color: '#2DFF7A' }}>
                            E-Centre
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
