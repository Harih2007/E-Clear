"use client"

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { api, handleApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, ArrowRight, CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [verificationSent, setVerificationSent] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError("Please enter a valid email address");
            return;
        }

        // Validate password strength
        if (formData.password.length < 8) {
            setError("Password must be at least 8 characters long");
            return;
        }

        setLoading(true);

        try {
            const res = await api.post("/auth/register", {
                name: formData.name,
                email: formData.email,
                password: formData.password
            });
            
            // Show verification message
            setVerificationSent(true);
            
            // Auto-login after 2 seconds
            setTimeout(() => {
                login(res.data.token, res.data.user);
                router.push("/dashboard/user");
            }, 2000);
        } catch (err: any) {
            setError(handleApiError(err));
            setLoading(false);
        }
    };

    if (verificationSent) {
        return (
            <div className="flex items-center justify-center min-h-screen p-6" style={{ backgroundColor: '#0B0F0E' }}>
                <div className="w-full max-w-md">
                    <div className="rounded-2xl p-8 backdrop-blur-md border-2 text-center"
                         style={{ 
                           backgroundColor: 'rgba(11, 15, 14, 0.6)', 
                           borderColor: '#2DFF7A',
                           boxShadow: '0 0 60px rgba(45, 255, 122, 0.2)'
                         }}>
                        <CheckCircle2 className="h-16 w-16 mx-auto mb-4" style={{ color: '#2DFF7A' }} />
                        <h2 className="text-2xl font-bold text-white mb-3">Account Created!</h2>
                        <p className="text-gray-400 mb-2">
                            Welcome to E-Clear, {formData.name}!
                        </p>
                        <p className="text-sm text-gray-500">
                            Redirecting to your dashboard...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen p-6" style={{ backgroundColor: '#0B0F0E' }}>
            <div className="w-full max-w-md">
                
                {/* Logo/Title */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-black text-white mb-2">E-Clear</h1>
                    <p className="text-gray-400">Create your account</p>
                </div>

                {/* Register Card */}
                <div className="rounded-2xl p-8 backdrop-blur-md border-2"
                     style={{ 
                       backgroundColor: 'rgba(11, 15, 14, 0.6)', 
                       borderColor: 'rgba(45, 255, 122, 0.3)',
                       boxShadow: '0 0 40px rgba(45, 255, 122, 0.1)'
                     }}>
                    
                    <form onSubmit={handleRegister} className="space-y-5">
                        
                        {/* Name Field */}
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                                <User className="h-4 w-4" style={{ color: '#2DFF7A' }} />
                                Full Name
                            </label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="h-12 rounded-xl transition-all focus:ring-2"
                                style={{ 
                                    backgroundColor: 'rgba(11, 15, 14, 0.8)', 
                                    borderColor: 'rgba(45, 255, 122, 0.3)',
                                    color: 'white'
                                }}
                            />
                        </div>

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
                                value={formData.email}
                                onChange={handleChange}
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
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="h-12 rounded-xl transition-all focus:ring-2"
                                style={{ 
                                    backgroundColor: 'rgba(11, 15, 14, 0.8)', 
                                    borderColor: 'rgba(45, 255, 122, 0.3)',
                                    color: 'white'
                                }}
                            />
                        </div>

                        {/* Confirm Password Field */}
                        <div className="space-y-2">
                            <label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                                <Lock className="h-4 w-4" style={{ color: '#2DFF7A' }} />
                                Confirm Password
                            </label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                className="h-12 rounded-xl transition-all focus:ring-2"
                                style={{ 
                                    backgroundColor: 'rgba(11, 15, 14, 0.8)', 
                                    borderColor: 'rgba(45, 255, 122, 0.3)',
                                    color: 'white'
                                }}
                            />
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(255, 68, 68, 0.1)', border: '1px solid rgba(255, 68, 68, 0.3)' }}>
                                <p className="text-red-400 text-sm font-medium text-center">{error}</p>
                            </div>
                        )}

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
                            {loading ? "Creating Account..." : "Sign Up"}
                            {!loading && <ArrowRight className="h-5 w-5" />}
                        </Button>
                    </form>
                </div>

                {/* Login Link */}
                <div className="text-center mt-6 space-y-3">
                    <p className="text-gray-400 text-sm">
                        Already have an account?{" "}
                        <Link href="/auth/login-user" className="font-bold hover:underline" style={{ color: '#2DFF7A' }}>
                            Login
                        </Link>
                    </p>
                    <p className="text-gray-500 text-sm">
                        Are you an E-Centre?{" "}
                        <Link href="/auth/register-ecentre" className="font-bold hover:underline" style={{ color: '#2DFF7A' }}>
                            Register as E-Centre
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
