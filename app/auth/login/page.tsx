"use client"

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { api, handleApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
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
            const res = await api.post("/auth/login", { email, password });
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
                    <CardTitle className="text-2xl text-primary text-center">Login to E-Clear</CardTitle>
                    <CardDescription className="text-center text-neutral-400">Welcome back! Please enter your details.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium text-neutral-300">Email</label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="bg-neutral-800 border-neutral-700 text-neutral-100"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium text-neutral-300">Password</label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="bg-neutral-800 border-neutral-700 text-neutral-100"
                            />
                        </div>
                        {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}
                        <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-neutral-950 font-bold" disabled={loading}>
                            {loading ? "Logging in..." : "Login"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-sm text-neutral-400">
                        Don't have an account? <Link href="/auth/register" className="text-primary hover:underline">Sign up</Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
