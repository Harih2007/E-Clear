"use client"

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { api, handleApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, Mail, Lock, Phone, MapPin, FileText, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function RegisterECentrePage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phoneNumber: "",
        address: "",
        licenseNumber: ""
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

        // Validate required fields
        if (!formData.phoneNumber || !formData.address || !formData.licenseNumber) {
            setError("All fields are required for E-Centre registration");
            return;
        }

        setLoading(true);

        try {
            const res = await api.post("/auth/register/ecentre", {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                phoneNumber: formData.phoneNumber,
                address: formData.address,
                licenseNumber: formData.licenseNumber,
                coordinates: { lat: 0, lng: 0 },
                serviceAreas: []
            });
            
            // Show verification message
            setVerificationSent(true);
            
            // Auto-login after 2 seconds
            setTimeout(() => {
                login(res.data.token, res.data.user);
                router.push("/dashboard/recycler");
            }, 2000);
        } catch (err: any) {
            setError(handleApiError(err));
            setLoading(false);
        }
    };

    if (verificationSent) {
        return (
            <div className="flex items-center justify-center min-h-screen p-6" style={{ backgroundColor: '#0B0F0E' }}>
                <motion.div 
                    className="w-full max-w-md"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="rounded-2xl p-8 backdrop-blur-md border-2 text-center"
                         style={{ 
                           backgroundColor: 'rgba(11, 15, 14, 0.6)', 
                           borderColor: '#2DFF7A',
                           boxShadow: '0 0 60px rgba(45, 255, 122, 0.2)'
                         }}>
                        <CheckCircle2 className="h-16 w-16 mx-auto mb-4" style={{ color: '#2DFF7A' }} />
                        <h2 className="text-2xl font-bold text-white mb-3">E-Centre Registered!</h2>
                        <p className="text-gray-400 mb-2">
                            Welcome to E-Clear, {formData.name}!
                        </p>
                        <p className="text-sm text-gray-500">
                            Redirecting to your dashboard...
                        </p>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen p-6" style={{ backgroundColor: '#0B0F0E' }}>
            <motion.div 
                className="w-full max-w-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Logo/Title */}
                <div className="text-center mb-8">
                    <motion.div 
                        className="flex items-center justify-center gap-3 mb-4"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <Building2 className="h-10 w-10" style={{ color: '#2DFF7A' }} />
                        <h1 className="text-4xl font-black text-white">E-Clear</h1>
                    </motion.div>
                    <motion.p 
                        className="text-gray-400 font-semibold text-lg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        Register Your E-Centre
                    </motion.p>
                    <motion.p 
                        className="text-sm text-gray-500 mt-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.25 }}
                    >
                        Join our network of recycling centers
                    </motion.p>
                </div>

                {/* Registration Card */}
                <motion.div 
                    className="rounded-2xl p-8 backdrop-blur-md border-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                    style={{ 
                       backgroundColor: 'rgba(11, 15, 14, 0.6)', 
                       borderColor: 'rgba(45, 255, 122, 0.3)',
                       boxShadow: '0 0 40px rgba(45, 255, 122, 0.1)'
                     }}>
                    
                    <form onSubmit={handleRegister} className="space-y-5">
                        
                        {/* Two Column Layout */}
                        <div className="grid md:grid-cols-2 gap-5">
                            {/* E-Centre Name */}
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                                    <Building2 className="h-4 w-4" style={{ color: '#2DFF7A' }} />
                                    E-Centre Name
                                </label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Green Tech Recyclers"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="h-12 rounded-xl"
                                    style={{ 
                                        backgroundColor: 'rgba(11, 15, 14, 0.8)', 
                                        borderColor: 'rgba(45, 255, 122, 0.3)',
                                        color: 'white'
                                    }}
                                />
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                                    <Mail className="h-4 w-4" style={{ color: '#2DFF7A' }} />
                                    Email Address
                                </label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="centre@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="h-12 rounded-xl"
                                    style={{ 
                                        backgroundColor: 'rgba(11, 15, 14, 0.8)', 
                                        borderColor: 'rgba(45, 255, 122, 0.3)',
                                        color: 'white'
                                    }}
                                />
                            </div>

                            {/* Password */}
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
                                    className="h-12 rounded-xl"
                                    style={{ 
                                        backgroundColor: 'rgba(11, 15, 14, 0.8)', 
                                        borderColor: 'rgba(45, 255, 122, 0.3)',
                                        color: 'white'
                                    }}
                                />
                            </div>

                            {/* Confirm Password */}
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
                                    className="h-12 rounded-xl"
                                    style={{ 
                                        backgroundColor: 'rgba(11, 15, 14, 0.8)', 
                                        borderColor: 'rgba(45, 255, 122, 0.3)',
                                        color: 'white'
                                    }}
                                />
                            </div>

                            {/* Phone Number */}
                            <div className="space-y-2">
                                <label htmlFor="phoneNumber" className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                                    <Phone className="h-4 w-4" style={{ color: '#2DFF7A' }} />
                                    Phone Number
                                </label>
                                <Input
                                    id="phoneNumber"
                                    type="tel"
                                    placeholder="+91-9876543210"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    required
                                    className="h-12 rounded-xl"
                                    style={{ 
                                        backgroundColor: 'rgba(11, 15, 14, 0.8)', 
                                        borderColor: 'rgba(45, 255, 122, 0.3)',
                                        color: 'white'
                                    }}
                                />
                            </div>

                            {/* License Number */}
                            <div className="space-y-2">
                                <label htmlFor="licenseNumber" className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                                    <FileText className="h-4 w-4" style={{ color: '#2DFF7A' }} />
                                    License Number
                                </label>
                                <Input
                                    id="licenseNumber"
                                    type="text"
                                    placeholder="ECO-BLR-2024-001"
                                    value={formData.licenseNumber}
                                    onChange={handleChange}
                                    required
                                    className="h-12 rounded-xl"
                                    style={{ 
                                        backgroundColor: 'rgba(11, 15, 14, 0.8)', 
                                        borderColor: 'rgba(45, 255, 122, 0.3)',
                                        color: 'white'
                                    }}
                                />
                            </div>
                        </div>

                        {/* Address - Full Width */}
                        <div className="space-y-2">
                            <label htmlFor="address" className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                                <MapPin className="h-4 w-4" style={{ color: '#2DFF7A' }} />
                                Full Address
                            </label>
                            <Input
                                id="address"
                                type="text"
                                placeholder="123 Industrial Area, Koramangala, Bangalore"
                                value={formData.address}
                                onChange={handleChange}
                                required
                                className="h-12 rounded-xl"
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
                            {loading ? "Creating Account..." : "Register E-Centre"}
                            {!loading && <ArrowRight className="h-5 w-5" />}
                        </Button>
                    </form>
                </motion.div>

                {/* Links */}
                <motion.div 
                    className="text-center mt-6 space-y-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <p className="text-gray-400 text-sm">
                        Already have an account?{" "}
                        <Link href="/auth/login-ecentre" className="font-bold hover:underline" style={{ color: '#2DFF7A' }}>
                            Login here
                        </Link>
                    </p>
                    <p className="text-gray-500 text-sm">
                        Are you a user?{" "}
                        <Link href="/auth/register" className="font-bold hover:underline" style={{ color: '#2DFF7A' }}>
                            Register as User
                        </Link>
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
}
