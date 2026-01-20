"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Box, Navigation, CheckCircle } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { api, handleApiError } from "@/lib/api"
import { useRouter } from "next/navigation"

export default function RecyclerDashboard() {
    const { user, isAuthenticated } = useAuth()
    const router = useRouter()

    const [pickups, setPickups] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/auth/login")
            return
        }
        if (user?.role !== "RECYCLER") {
            // Redirect or show Access Denied. For now let's just show but maybe disable actions?
            // Actually, redirects are better.
            // router.push("/dashboard/user") 
            // But for demo purposes, we might want to allow viewing.
        }
        fetchPickups()
    }, [isAuthenticated, user])

    const fetchPickups = async () => {
        try {
            // Fetch PENDING or ASSIGNED pickups
            // We can filter by zipCode if we want, but for now fetch all pending
            const res = await api.get("/pickups?status=PENDING")
            setPickups(res.data.data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleAccept = async (pickupId: string) => {
        // In our simple logic, confirming IS completing. 
        // Real logic: Accept -> Assigned -> Complete.
        // We will call Confirm directly for this Hackathon demo to award points immediately.
        if (confirm("Confirm cleanup and distribute rewards?")) {
            try {
                await api.patch("/pickup/confirm", { pickupId })
                alert("Pickup Completed! Points distributed.")
                fetchPickups() // Refresh
            } catch (err) {
                alert(handleApiError(err))
            }
        }
    }

    if (loading) return <div className="p-8">Loading Recycler Portal...</div>

    return (
        <div className="container py-8 px-4 max-w-screen-2xl">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Recycler Portal</h1>
                    <p className="text-muted-foreground">Welcome, {user?.name}. Available pickups nearby.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <MapPin className="mr-2 h-4 w-4" /> Map View
                    </Button>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">

                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-xl font-semibold">Available Pickups</h2>
                    <div className="grid gap-4">
                        {pickups.length === 0 ? (
                            <p className="text-muted-foreground">No pending pickups available.</p>
                        ) : (
                            pickups.map((pickup) => (
                                <Card key={pickup._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-primary/10 p-3 rounded-full h-12 w-12 flex items-center justify-center shrink-0">
                                            <Box className="h-6 w-6 text-primary" />
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="font-semibold text-lg">Batch Pickup</h3>
                                            <div className="flex items-center text-sm text-muted-foreground gap-3">
                                                <span className="flex items-center"><MapPin className="h-3 w-3 mr-1" /> Zip: {pickup.zipCode}</span>
                                                <span>•</span>
                                                <span>{pickup.requestIds?.length || 0} Requests</span>
                                            </div>
                                            <Badge variant="outline" className="mt-1">Status: {pickup.status}</Badge>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 w-full sm:w-auto">
                                        <Button
                                            className="flex-1 sm:flex-initial"
                                            variant="default"
                                            onClick={() => handleAccept(pickup._id)}
                                        >
                                            Complete & Verify
                                        </Button>
                                    </div>
                                </Card>
                            ))
                        )}
                    </div>
                </div>

                {/* Sidebar Stats */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Your Stats</CardTitle>
                            <CardDescription>Performance Overview</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center border-b pb-4">
                                <span className="text-muted-foreground">Pickups Completed</span>
                                {/* Mock Data for now */}
                                <span className="font-bold text-xl">0</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Total Earnings</span>
                                <span className="font-bold text-xl text-primary">$0</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    )
}
