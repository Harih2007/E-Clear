"use client"

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { api, handleApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, ArrowRight, User } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginUserPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            console.log("Attempting login with:", { email, role: "USER" });
            const res = await api.post("/auth/login", { email, password, role: "USER" });
            console.log("Login successful:", res.data);
            login(res.data.token, res.data.user);
            router.push("/dashboard/user");
        } catch (err: any) {
            console.error("Login error:", err);
            console.error("Error response:", err.response?.data);
            setError(handleApiError(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-6" style={{ backgroundColor: '#0B0F0E' }}>
            <motion.div 
                className="w-full max-w-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                
                {/* Logo/Title */}
                <div className="text-center mb-8">
                    <motion.div 
                        className="flex items-center justify-center gap-3 mb-4"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                    >
                        <User className="h-10 w-10" style={{ color: '#2DFF7A' }} />
                        <h1 className="text-4xl font-black text-white">E-Clear</h1>
                    </motion.div>
                    <motion.p 
                        className="text-gray-400 font-semibold text-lg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                    >
                        User Login
                    </motion.p>
                    <motion.p 
                        className="text-sm text-gray-500 mt-2 h-10 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.25, ease: "easeOut" }}
                    >
                        Login to schedule your e-waste pickup
                    </motion.p>
                </div>

                {/* Login Card */}
                <motion.div 
                    className="rounded-2xl p-8 backdrop-blur-md border-2 flex flex-col"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ 
                        y: -8,
                        boxShadow: '0 0 60px rgba(45, 255, 122, 0.3)',
                        borderColor: 'rgba(45, 255, 122, 0.5)',
                        transition: {
                            type: "spring",
                            stiffness: 300,
                            damping: 20
                        }
                    }}
                    transition={{ 
                        duration: 0.5, 
                        delay: 0.15, 
                        ease: "easeOut"
                    }}
                    style={{ 
                       backgroundColor: 'rgba(11, 15, 14, 0.6)', 
                       borderColor: 'rgba(45, 255, 122, 0.3)',
                       boxShadow: '0 0 40px rgba(45, 255, 122, 0.1)',
                       minHeight: '480px',
                       height: '480px'
                     }}>
                    
                    <form onSubmit={handleLogin} className="space-y-6 flex-1 flex flex-col">
                        
                        {/* Email Field */}
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                                <Mail className="h-4 w-4" style={{ color: '#2DFF7A' }} />
                                Email Address
                            </label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="h-12 rounded-xl transition-all focus:ring-2"
                                style={{ 
                                    backgroundColor: 'rgba(11, 15, 14, 0.8)', 
                                    borderColor: 'rgba(45, 255, 122, 0.3)',
                                    color: 'white'
                                }}
                            />
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                                <Lock className="h-4 w-4" style={{ color: '#2DFF7A' }} />
                                Password
                            </label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="h-12 rounded-xl transition-all focus:ring-2"
                                style={{ 
                                    backgroundColor: 'rgba(11, 15, 14, 0.8)', 
                                    borderColor: 'rgba(45, 255, 122, 0.3)',
                                    color: 'white'
                                }}
                            />
                        </div>

                        {/* Error Message - Fixed Height */}
                        <div className="h-16 flex items-center justify-center">
                            {error && (
                                <div className="w-full p-4 rounded-xl" style={{ backgroundColor: 'rgba(255, 68, 68, 0.1)', border: '1px solid rgba(255, 68, 68, 0.3)' }}>
                                    <p className="text-red-400 text-sm font-medium text-center">{error}</p>
                                </div>
                            )}
                        </div>

                        {/* Spacer to push button to bottom */}
                        <div className="flex-1"></div>

                        {/* Submit Button */}
                        <Button 
                            type="submit" 
                            className="w-full h-14 font-bold rounded-xl transition-all hover:scale-105 flex items-center justify-center gap-2" 
                            disabled={loading}
                            style={{ 
                                backgroundColor: '#2DFF7A', 
                                color: '#0B0F0E',
                                boxShadow: '0 0 30px rgba(45, 255, 122, 0.4)'
                            }}>
                            {loading ? "Logging in..." : "Login as User"}
                            {!loading && <ArrowRight className="h-5 w-5" />}
                        </Button>
                    </form>
                </motion.div>

                {/* Links - Fixed Height */}
                <motion.div 
                    className="text-center mt-6 space-y-3 h-20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
                >
                    <p className="text-gray-400 text-sm">
                        Don't have an account?{" "}
                        <Link href="/auth/register" className="font-bold hover:underline" style={{ color: '#2DFF7A' }}>
                            Register here
                        </Link>
                    </p>
                    <p className="text-gray-500 text-sm">
                        Are you an E-Centre?{" "}
                        <Link href="/auth/login-ecentre" className="font-bold hover:underline" style={{ color: '#2DFF7A' }}>
                            Login here
                        </Link>
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
}
