"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Recycle } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"

export function Navbar() {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)
    const { user, logout, isAuthenticated } = useAuth()

    const navItems = [
        { name: "Home", href: "/" },
        ...(user?.role === "RECYCLER"
            ? [{ name: "Recycler Dashboard", href: "/dashboard/recycler" }]
            : [{ name: "Dashboard", href: "/dashboard/user" }]
        ),
    ]

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4">
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="bg-primary/10 p-2 rounded-full">
                            <Recycle className="h-6 w-6 text-primary" />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-primary">E-Clear</span>
                    </Link>
                </div>

                {/* Desktop Nav */}
                <div className="hidden md:flex gap-6 items-center">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-primary",
                                pathname === item.href
                                    ? "text-primary"
                                    : "text-muted-foreground"
                            )}
                        >
                            {item.name}
                        </Link>
                    ))}

                    {isAuthenticated ? (
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-neutral-400">Hi, {user?.name}</span>
                            <Button size="sm" variant="outline" onClick={logout}>Logout</Button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link href="/auth/login">
                                <Button variant="ghost" size="sm">Login</Button>
                            </Link>
                            <Link href="/auth/register">
                                <Button size="sm">Get Started</Button>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Toggle */}
                <div className="md:hidden">
                    <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
                        <Menu className="h-6 w-6" />
                    </Button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden border-t p-4 bg-background">
                    <div className="flex flex-col space-y-4">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="text-sm font-medium transition-colors hover:text-primary"
                                onClick={() => setIsOpen(false)}
                            >
                                {item.name}
                            </Link>
                        ))}
                        {isAuthenticated ? (
                            <Button variant="outline" onClick={logout}>Logout</Button>
                        ) : (
                            <>
                                <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                                    <Button variant="ghost" className="w-full">Login</Button>
                                </Link>
                                <Link href="/auth/register" onClick={() => setIsOpen(false)}>
                                    <Button className="w-full">Get Started</Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    )
}
