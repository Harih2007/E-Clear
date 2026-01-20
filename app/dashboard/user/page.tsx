"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, MapPin, Smartphone, Battery, Laptop, CheckCircle, Clock, Trash2, Box } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { api, handleApiError } from "@/lib/api"
import { Modal } from "@/components/ui/modal"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"

// Dynamic Import for Map (Client Side Only)
const Map = dynamic(() => import("@/components/ui/map"), {
    loading: () => <div className="h-full w-full bg-muted animate-pulse rounded-b-lg" />,
    ssr: false
})

export default function UserDashboard() {
    const { user, isAuthenticated } = useAuth()
    const router = useRouter()

    const [requests, setRequests] = useState<any[]>([])
    const [stats, setStats] = useState({ totalPoints: 0, itemsRecycled: 0 })
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)

    // Form State
    const [formData, setFormData] = useState({
        type: "LAPTOP",
        quantity: 1,
        address: "123 Green St",
        zipCode: user?.location?.zipCode || ""
    })

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/auth/login")
            return
        }
        fetchData()
    }, [isAuthenticated, user])

    const fetchData = async () => {
        if (!user) return
        try {
            const res = await api.get(`/user/${user._id}/requests`)
            setRequests(res.data.data)

            // Calc stats
            const totalPoints = user.points || 0;
            const itemsRecycled = res.data.data.reduce((acc: number, req: any) => acc + req.items.length, 0)
            setStats({ totalPoints, itemsRecycled })
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await api.post("/dispose", {
                userId: user?._id,
                items: [{ type: formData.type, quantity: Number(formData.quantity) }],
                location: { address: formData.address, zipCode: formData.zipCode }
            })
            setIsModalOpen(false)
            fetchData() // Refresh
        } catch (err) {
            alert(handleApiError(err))
        }
    }

    const getIcon = (type: string) => {
        switch (type) {
            case "LAPTOP": return <Laptop className="h-4 w-4" />
            case "MOBILE": return <Smartphone className="h-4 w-4" />
            case "BATTERY": return <Battery className="h-4 w-4" />
            default: return <Box className="h-4 w-4" />
        }
    }

    if (loading) return <div className="p-8">Loading Dashboard...</div>

    return (
        <div className="container py-8 px-4 max-w-screen-2xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">Welcome back, {user?.name}</p>
                </div>
                <Button className="gap-2" onClick={() => setIsModalOpen(true)}>
                    <Plus className="h-4 w-4" /> Dispose New Item
                </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-8">
                    {/* Stats */}
                    <div className="grid sm:grid-cols-2 gap-4">
                        <Card className="bg-primary/5 border-primary/20">
                            <CardHeader className="pb-2">
                                <CardDescription>Total Requests</CardDescription>
                                <CardTitle className="text-4xl text-primary">{requests.length}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm text-muted-foreground">Disposal requests made</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardDescription>Eco-Points</CardDescription>
                                <CardTitle className="text-4xl">{user?.points || 0}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm text-muted-foreground">Available to redeem</div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Recent Activity */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Your Requests</CardTitle>
                            <CardDescription>Track the status of your disposals.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {requests.length === 0 ? (
                                    <div className="text-center py-8 text-neutral-500">No requests yet. Recycle something today!</div>
                                ) : (
                                    requests.map((req, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-accent/5 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="p-2 bg-secondary rounded-full">
                                                    {getIcon(req.items[0].type)}
                                                </div>
                                                <div>
                                                    <p className="font-medium">{req.items[0].type} (x{req.items[0].quantity})</p>
                                                    <p className="text-xs text-muted-foreground">ID: {req._id.slice(-6)}</p>
                                                </div>
                                            </div>
                                            <Badge variant={req.status === "COLLECTED" ? "success" : "secondary"}>
                                                {req.status}
                                            </Badge>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    <Card className="h-[400px] flex flex-col">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><MapPin className="h-5 w-5 text-primary" /> Nearby Drop-offs</CardTitle>
                            <CardDescription>Interactive Map of Collection Points</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 p-0 relative bg-muted rounded-b-lg overflow-hidden">
                            <Map />
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Dispose Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Dispose E-Waste">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Item Type</label>
                        <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        >
                            <option value="LAPTOP">Laptop (500 pts)</option>
                            <option value="MOBILE">Mobile (200 pts)</option>
                            <option value="BATTERY">Battery (10 pts)</option>
                            <option value="OTHER">Other (50 pts)</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Quantity</label>
                        <Input
                            type="number"
                            min="1"
                            value={formData.quantity}
                            onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Zip Code</label>
                        <Input
                            type="text"
                            value={formData.zipCode}
                            onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                        />
                    </div>
                    <Button type="submit" className="w-full">Submit Request</Button>
                </form>
            </Modal>
        </div>
    )
}
