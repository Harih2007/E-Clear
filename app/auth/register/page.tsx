"use client"

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { api, handleApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        zipCode: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await api.post("/auth/register", formData);
            login(res.data.token, res.data.user);
        } catch (err: any) {
            setError(handleApiError(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-neutral-950 p-4">
            <Card className="w-full max-w-md bg-neutral-900 border-neutral-800">
                <CardHeader>
                    <CardTitle className="text-2xl text-primary text-center">Create an Account</CardTitle>
                    <CardDescription className="text-center text-neutral-400">Join E-Clear and start recycling today.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleRegister} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium text-neutral-300">Full Name</label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="bg-neutral-800 border-neutral-700 text-neutral-100"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium text-neutral-300">Email</label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="bg-neutral-800 border-neutral-700 text-neutral-100"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium text-neutral-300">Password</label>
                            <Input
                                id="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="bg-neutral-800 border-neutral-700 text-neutral-100"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="zipCode" className="text-sm font-medium text-neutral-300">Zip Code</label>
                            <Input
                                id="zipCode"
                                type="text"
                                placeholder="12345"
                                value={formData.zipCode}
                                onChange={handleChange}
                                required
                                maxLength={5}
                                className="bg-neutral-800 border-neutral-700 text-neutral-100"
                            />
                        </div>
                        {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}
                        <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-neutral-950 font-bold" disabled={loading}>
                            {loading ? "Register" : "Sign Up"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-sm text-neutral-400">
                        Already have an account? <Link href="/auth/login" className="text-primary hover:underline">Login</Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
