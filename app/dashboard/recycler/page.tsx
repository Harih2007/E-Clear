"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Building2, MapPin, Box, Truck, CheckCircle, Users, Package, Calendar, TrendingUp, Phone, Mail, Clock } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { api, handleApiError } from "@/lib/api"
import { useRouter } from "next/navigation"

export default function RecyclerDashboard() {
    const { user, isAuthenticated } = useAuth()
    const router = useRouter()

    const [requests, setRequests] = useState<any[]>([])
    const [stats, setStats] = useState({
        pending: 0,
        completed: 0,
        totalItems: 0
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/auth/login-ecentre")
            return
        }
        // Check if user has correct role
        if ((user as any)?.role !== "ECENTRE") {
            router.push("/dashboard/user")
            return
        }
        fetchData()
    }, [isAuthenticated, user])

    const fetchData = async () => {
        try {
            // Fetch all disposal requests (in a real app, filter by service area)
            const res = await api.get("/disposal/requests")
            const allRequests = res.data.data || []
            
            setRequests(allRequests)
            
            // Calculate stats
            const pending = allRequests.filter((r: any) => r.status === "PENDING" || r.status === "GROUPING").length
            const completed = allRequests.filter((r: any) => r.status === "COLLECTED").length
            const totalItems = allRequests.reduce((acc: number, r: any) => acc + (r.items?.length || 0), 0)
            
            setStats({ pending, completed, totalItems })
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleSchedulePickup = async (requestId: string) => {
        if (confirm("Schedule this pickup for collection?")) {
            try {
                await api.patch(`/disposal/${requestId}/status`, { status: "SCHEDULED" })
                alert("Pickup scheduled successfully!")
                fetchData()
            } catch (err) {
                alert(handleApiError(err))
            }
        }
    }

    const handleMarkCollected = async (requestId: string) => {
        if (confirm("Mark this pickup as collected?")) {
            try {
                await api.patch(`/disposal/${requestId}/status`, { status: "COLLECTED" })
                alert("Marked as collected!")
                fetchData()
            } catch (err) {
                alert(handleApiError(err))
            }
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "PENDING": return "bg-yellow-100 text-yellow-700 border-yellow-200"
            case "GROUPING": return "bg-blue-100 text-blue-700 border-blue-200"
            case "SCHEDULED": return "bg-purple-100 text-purple-700 border-purple-200"
            case "COLLECTED": return "bg-emerald-100 text-emerald-700 border-emerald-200"
            default: return "bg-gray-100 text-gray-700 border-gray-200"
        }
    }

    if (loading) return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 flex items-center justify-center">
            <div className="text-emerald-700 text-lg">Loading E-Centre Portal...</div>
        </div>
    )

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-sm border-b border-emerald-100 sticky top-0 z-10">
                <div className="container mx-auto px-6 py-4 max-w-7xl">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-emerald-900 flex items-center gap-3">
                                <Building2 className="h-8 w-8 text-emerald-600" />
                                {user?.name || "E-Centre Portal"}
                            </h1>
                            <p className="text-emerald-600 text-sm mt-1">Manage pickup requests and collections</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="px-4 py-2 bg-emerald-100 rounded-lg">
                                <p className="text-xs text-emerald-600 font-semibold">Status</p>
                                <p className="text-sm font-bold text-emerald-900">Active</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-6 py-8 max-w-7xl space-y-6">
                
                {/* Stats Grid */}
                <div className="grid sm:grid-cols-3 gap-6">
                    <div className="bg-white rounded-2xl p-6 shadow-md border border-emerald-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
                                <Clock className="h-6 w-6 text-yellow-600" />
                            </div>
                            <TrendingUp className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div className="text-xs text-emerald-600 font-semibold uppercase tracking-wide mb-2">Pending Requests</div>
                        <div className="text-4xl font-bold text-emerald-900 mb-1">{stats.pending}</div>
                        <div className="text-xs text-gray-500">Awaiting action</div>
                    </div>
                    
                    <div className="bg-white rounded-2xl p-6 shadow-md border border-emerald-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                                <CheckCircle className="h-6 w-6 text-emerald-600" />
                            </div>
                            <TrendingUp className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div className="text-xs text-emerald-600 font-semibold uppercase tracking-wide mb-2">Completed</div>
                        <div className="text-4xl font-bold text-emerald-900 mb-1">{stats.completed}</div>
                        <div className="text-xs text-gray-500">Total collections</div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-md border border-emerald-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                                <Package className="h-6 w-6 text-blue-600" />
                            </div>
                            <TrendingUp className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div className="text-xs text-emerald-600 font-semibold uppercase tracking-wide mb-2">Total Items</div>
                        <div className="text-4xl font-bold text-emerald-900 mb-1">{stats.totalItems}</div>
                        <div className="text-xs text-gray-500">E-waste collected</div>
                    </div>
                </div>

                {/* E-Centre Info Card */}
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 shadow-lg text-white">
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="text-xl font-bold mb-2">Your E-Centre Information</h3>
                            <div className="space-y-2 text-emerald-50">
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4" />
                                    <span className="text-sm">{(user as any)?.email}</span>
                                </div>
                                {(user as any)?.location?.address && (
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4" />
                                        <span className="text-sm">{(user as any).location.address}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="w-16 h-16 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <Building2 className="h-8 w-8" />
                        </div>
                    </div>
                </div>

                {/* Pickup Requests Table */}
                <div className="bg-white rounded-2xl shadow-md border border-emerald-100 overflow-hidden">
                    <div className="p-6 border-b border-emerald-100 bg-emerald-50/50">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-emerald-900 flex items-center gap-2">
                                    <Truck className="h-6 w-6 text-emerald-600" />
                                    Pickup Requests
                                </h2>
                                <p className="text-sm text-emerald-600 mt-1">Manage and schedule collections</p>
                            </div>
                            <Button 
                                className="h-10 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold">
                                <Calendar className="h-4 w-4 mr-2" />
                                Schedule Route
                            </Button>
                        </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                        {requests.length === 0 ? (
                            <div className="text-center py-16">
                                <Package className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                                <p className="text-gray-600 font-medium">No pickup requests yet</p>
                                <p className="text-sm text-gray-400 mt-1">Requests will appear here when users submit them</p>
                            </div>
                        ) : (
                            <table className="w-full">
                                <thead className="bg-emerald-50/50">
                                    <tr>
                                        <th className="text-left p-4 text-xs font-bold text-emerald-700 uppercase tracking-wider">Request ID</th>
                                        <th className="text-left p-4 text-xs font-bold text-emerald-700 uppercase tracking-wider">Items</th>
                                        <th className="text-left p-4 text-xs font-bold text-emerald-700 uppercase tracking-wider">Location</th>
                                        <th className="text-left p-4 text-xs font-bold text-emerald-700 uppercase tracking-wider">Status</th>
                                        <th className="text-left p-4 text-xs font-bold text-emerald-700 uppercase tracking-wider">Date</th>
                                        <th className="text-right p-4 text-xs font-bold text-emerald-700 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {requests.map((request, idx) => (
                                        <tr key={request._id} className="border-b border-emerald-50 hover:bg-emerald-50/30 transition-colors">
                                            <td className="p-4">
                                                <div className="font-mono text-sm font-semibold text-emerald-900">
                                                    #{request._id.slice(-6).toUpperCase()}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                                                        <Box className="h-4 w-4 text-emerald-600" />
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-gray-900 text-sm">
                                                            {request.items?.[0]?.type || "Unknown"}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            Qty: {request.items?.[0]?.quantity || 0}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="h-4 w-4 text-emerald-600" />
                                                    <span className="text-sm text-gray-700">{request.pincode || "N/A"}</span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className={`inline-flex px-3 py-1 rounded-lg text-xs font-bold border ${getStatusColor(request.status)}`}>
                                                    {request.status}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className="text-sm text-gray-600">
                                                    {new Date(request.createdAt).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex gap-2 justify-end">
                                                    {request.status === "PENDING" || request.status === "GROUPING" ? (
                                                        <Button
                                                            size="sm"
                                                            className="h-9 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-xs"
                                                            onClick={() => handleSchedulePickup(request._id)}
                                                        >
                                                            Schedule
                                                        </Button>
                                                    ) : request.status === "SCHEDULED" ? (
                                                        <Button
                                                            size="sm"
                                                            className="h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-xs"
                                                            onClick={() => handleMarkCollected(request._id)}
                                                        >
                                                            Mark Collected
                                                        </Button>
                                                    ) : (
                                                        <span className="text-xs text-gray-500 px-4">Completed</span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

            </div>
        </div>
    )
}
