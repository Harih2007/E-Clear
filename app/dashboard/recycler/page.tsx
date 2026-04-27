"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Building2, MapPin, Box, Truck, CheckCircle, Users, Package, Calendar, TrendingUp, Phone, Mail, Clock, User, Map as MapIcon } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { api, handleApiError } from "@/lib/api"
import { useRouter } from "next/navigation"
import { Modal } from "@/components/ui/modal"
import dynamic from 'next/dynamic'

const MapComponent = dynamic(() => import('@/components/ui/map'), { ssr: false })

export default function RecyclerDashboard() {
    const { user, isAuthenticated, refreshUser, isLoading } = useAuth()
    const router = useRouter()

    const [requests, setRequests] = useState<any[]>([])
    const [stats, setStats] = useState({
        pending: 0,
        completed: 0,
        totalItems: 0
    })
    const [loading, setLoading] = useState(true)
    const [pickupPersons, setPickupPersons] = useState<any[]>([])
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false)
    const [selectedRequest, setSelectedRequest] = useState<any>(null)
    const [selectedPerson, setSelectedPerson] = useState<string>("")
    const [isRouteModalOpen, setIsRouteModalOpen] = useState(false)
    const [showMap, setShowMap] = useState(false)
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false)
    const [locationAddress, setLocationAddress] = useState("")
    const [locationCoords, setLocationCoords] = useState<{lat: number, lng: number} | null>(null)

    useEffect(() => {
        // Wait for auth to load
        if (isLoading) return;
        
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
    }, [isAuthenticated, user, isLoading])

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
            
            // Fetch pickup persons (mock data for now, will come from E-Centre profile)
            setPickupPersons([
                { id: 'person-1', name: 'Ramesh Kumar', phone: '+91-9876543301', vehicle: 'BIKE' },
                { id: 'person-2', name: 'Rahul Sharma', phone: '+91-9876543302', vehicle: 'PICKUP_TRUCK' },
                { id: 'person-3', name: 'Suresh Patel', phone: '+91-9876543303', vehicle: 'BIKE' },
                { id: 'person-4', name: 'Vijay Singh', phone: '+91-9876543304', vehicle: 'PICKUP_TRUCK' }
            ])
        } catch (err: any) {
            console.error("Error fetching requests:", err)
            // If 401, token might be invalid
            if (err.response?.status === 401) {
                console.error("Authentication failed - redirecting to login")
                router.push("/auth/login-ecentre")
            }
        } finally {
            setLoading(false)
        }
    }

    const handleSchedulePickup = async (request: any) => {
        // Check if grouping target is met
        if (request.groupingProgress && request.groupingProgress.current < request.groupingProgress.target) {
            alert(`⚠️ Cannot schedule yet! Waiting for more households to join.\nCurrent: ${request.groupingProgress.current}/${request.groupingProgress.target}`)
            return
        }
        
        // Open modal to select pickup person
        setSelectedRequest(request)
        setIsScheduleModalOpen(true)
    }
    
    const confirmSchedule = async () => {
        if (!selectedPerson) {
            alert('⚠️ Please select a pickup person')
            return
        }
        
        const person = pickupPersons.find(p => p.id === selectedPerson)
        if (!person) return
        
        console.log('Scheduling pickup with:', {
            requestId: selectedRequest._id,
            person,
            status: 'SCHEDULED'
        })
        
        try {
            const response = await api.patch(`/disposal/${selectedRequest._id}/status`, { 
                status: "SCHEDULED",
                assignedPickupPerson: {
                    id: person.id,
                    name: person.name,
                    phone: person.phone,
                    vehicle: person.vehicle
                }
            })
            console.log('Schedule response:', response.data)
            alert(`✅ Pickup scheduled with ${person.name}!`)
            setIsScheduleModalOpen(false)
            setSelectedRequest(null)
            setSelectedPerson("")
            fetchData()
        } catch (err: any) {
            console.error('Schedule error:', err)
            console.error('Error response:', err.response?.data)
            alert(handleApiError(err))
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

    const handleScheduleRoute = () => {
        const scheduledRequests = requests.filter(r => r.status === "SCHEDULED")
        if (scheduledRequests.length === 0) {
            alert("⚠️ No scheduled pickups to route. Please schedule some pickups first.")
            return
        }
        setIsRouteModalOpen(true)
    }

    const handleUpdateLocation = () => {
        setLocationAddress((user as any)?.location?.address || "")
        setLocationCoords((user as any)?.location?.coordinates || null)
        setIsLocationModalOpen(true)
    }

    const handleUseCurrentLocation = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const lat = position.coords.latitude
                    const lng = position.coords.longitude
                    setLocationCoords({ lat, lng })
                    
                    // Reverse geocode
                    try {
                        const response = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
                        )
                        const data = await response.json()
                        setLocationAddress(data.display_name)
                    } catch (err) {
                        console.error("Reverse geocoding failed:", err)
                    }
                },
                (error) => {
                    alert("Unable to get your location. Please enter manually.")
                }
            )
        } else {
            alert("Geolocation is not supported by your browser")
        }
    }

    const confirmLocationUpdate = async () => {
        if (!locationAddress || !locationCoords) {
            alert("⚠️ Please set a location first")
            return
        }

        try {
            await api.patch("/auth/update-location", {
                address: locationAddress,
                coordinates: locationCoords
            })
            
            // Update user in context
            const updatedUser = {
                ...user,
                location: {
                    address: locationAddress,
                    coordinates: locationCoords
                }
            } as any
            
            refreshUser(updatedUser)
            
            alert("✅ Location updated successfully!")
            setIsLocationModalOpen(false)
            
            // Refresh data
            fetchData()
        } catch (err) {
            alert(handleApiError(err))
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

    if (loading || isLoading) return (
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
                    <div className="flex items-start justify-between mb-4">
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
                                {(user as any)?.phoneNumber && (
                                    <div className="flex items-center gap-2">
                                        <Phone className="h-4 w-4" />
                                        <span className="text-sm">{(user as any).phoneNumber}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="w-16 h-16 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <Building2 className="h-8 w-8" />
                        </div>
                    </div>
                    <Button
                        onClick={handleUpdateLocation}
                        className="w-full h-10 bg-white/20 hover:bg-white/30 text-white border border-white/30 rounded-lg font-semibold"
                    >
                        <MapPin className="h-4 w-4 mr-2" />
                        Update Location
                    </Button>
                </div>

                {/* Map Section */}
                <div className="bg-white rounded-2xl shadow-md border border-emerald-100 overflow-hidden">
                    <div className="p-6 border-b border-emerald-100 bg-emerald-50/50">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-emerald-900 flex items-center gap-2">
                                    <MapIcon className="h-6 w-6 text-emerald-600" />
                                    Pickup Locations Map
                                </h2>
                                <p className="text-sm text-emerald-600 mt-1">View all pickup locations and your E-Centre</p>
                            </div>
                            <Button 
                                onClick={() => setShowMap(!showMap)}
                                className="h-10 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold">
                                {showMap ? 'Hide Map' : 'Show Map'}
                            </Button>
                        </div>
                    </div>
                    
                    {showMap && (
                        <>
                            <div className="h-96">
                                <MapComponent
                                    center={
                                        (user as any)?.location?.coordinates 
                                            ? { lat: (user as any).location.coordinates.lat, lng: (user as any).location.coordinates.lng }
                                            : { lat: 12.9716, lng: 77.5946 } // Default to Bangalore
                                    }
                                    markers={[
                                        // E-Centre location
                                        ...((user as any)?.location?.coordinates ? [{
                                            position: { 
                                                lat: (user as any).location.coordinates.lat, 
                                                lng: (user as any).location.coordinates.lng 
                                            },
                                            title: "Your E-Centre",
                                            type: "ecentre" as const
                                        }] : []),
                                        // Pickup locations
                                        ...requests
                                            .filter(r => r.location?.coordinates)
                                            .map(r => ({
                                                position: { 
                                                    lat: r.location.coordinates.lat, 
                                                    lng: r.location.coordinates.lng 
                                                },
                                                title: `${r.userDetails?.name || 'User'} - ${r.status}`,
                                                type: r.status === "SCHEDULED" ? "scheduled" as const : "pending" as const
                                            }))
                                    ]}
                                    zoom={12}
                                />
                            </div>
                            <div className="p-4 bg-gray-50 border-t border-gray-200">
                                <p className="text-xs font-semibold text-gray-600 mb-2">Map Legend:</p>
                                <div className="flex flex-wrap gap-4 text-xs">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                        <span className="text-gray-700">Your E-Centre</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                                        <span className="text-gray-700">Pending Pickup</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                                        <span className="text-gray-700">Scheduled Pickup</span>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
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
                                onClick={handleScheduleRoute}
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
                                        <th className="text-left p-4 text-xs font-bold text-emerald-700 uppercase tracking-wider">User</th>
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
                                                {request.userDetails ? (
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                                                            <User className="h-4 w-4 text-blue-600" />
                                                        </div>
                                                        <div>
                                                            <div className="font-semibold text-gray-900 text-sm">
                                                                {request.userDetails.name}
                                                            </div>
                                                            {request.userDetails.phoneNumber && (
                                                                <a 
                                                                    href={`tel:${request.userDetails.phoneNumber}`}
                                                                    className="text-xs text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1"
                                                                >
                                                                    <Phone className="h-3 w-3" />
                                                                    {request.userDetails.phoneNumber}
                                                                </a>
                                                            )}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-gray-500">N/A</span>
                                                )}
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
                                                    <span className="text-sm text-gray-700">{request.location?.pincode || "N/A"}</span>
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
                                                            onClick={() => handleSchedulePickup(request)}
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

            {/* Pickup Person Selection Modal */}
            <Modal isOpen={isScheduleModalOpen} onClose={() => setIsScheduleModalOpen(false)} title="Select Pickup Person">
                <div className="space-y-4">
                    <p className="text-sm text-gray-600">Choose who will handle this pickup:</p>
                    
                    <div className="space-y-2">
                        {pickupPersons.map((person) => (
                            <div
                                key={person.id}
                                onClick={() => setSelectedPerson(person.id)}
                                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                    selectedPerson === person.id
                                        ? 'border-emerald-500 bg-emerald-50'
                                        : 'border-gray-200 hover:border-emerald-300 bg-white'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                                            <User className="h-5 w-5 text-emerald-600" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">{person.name}</p>
                                            <p className="text-sm text-gray-600">{person.phone}</p>
                                        </div>
                                    </div>
                                    <div className="text-xs px-3 py-1.5 rounded-lg bg-blue-100 text-blue-700 font-semibold">
                                        {person.vehicle === 'BIKE' ? '🏍️ Bike' : '🚚 Pickup Truck'}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <Button
                        onClick={confirmSchedule}
                        disabled={!selectedPerson}
                        className="w-full h-12 font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Confirm Schedule
                    </Button>
                </div>
            </Modal>

            {/* Route Planning Modal */}
            <Modal isOpen={isRouteModalOpen} onClose={() => setIsRouteModalOpen(false)} title="Scheduled Pickup Route">
                <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                        View all scheduled pickups and plan your collection route:
                    </p>
                    
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                        {requests
                            .filter(r => r.status === "SCHEDULED")
                            .map((request, idx) => (
                                <div key={request._id} className="p-4 rounded-xl border-2 border-emerald-200 bg-emerald-50">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                                            {idx + 1}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-2">
                                                <p className="font-semibold text-gray-900">
                                                    {request.userDetails?.name || 'User'}
                                                </p>
                                                <span className="text-xs px-2 py-1 rounded bg-purple-100 text-purple-700 font-semibold">
                                                    SCHEDULED
                                                </span>
                                            </div>
                                            
                                            <div className="space-y-1 text-sm text-gray-600">
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="h-4 w-4 text-emerald-600" />
                                                    <span>{request.location?.address || 'Address not available'}</span>
                                                </div>
                                                {request.userDetails?.phoneNumber && (
                                                    <div className="flex items-center gap-2">
                                                        <Phone className="h-4 w-4 text-emerald-600" />
                                                        <a 
                                                            href={`tel:${request.userDetails.phoneNumber}`}
                                                            className="text-blue-600 hover:underline"
                                                        >
                                                            {request.userDetails.phoneNumber}
                                                        </a>
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-2">
                                                    <Box className="h-4 w-4 text-emerald-600" />
                                                    <span>{request.items?.[0]?.type} × {request.items?.[0]?.quantity}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                    
                    <div className="pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between text-sm mb-3">
                            <span className="text-gray-600">Total Scheduled Pickups:</span>
                            <span className="font-bold text-emerald-900">
                                {requests.filter(r => r.status === "SCHEDULED").length}
                            </span>
                        </div>
                        <Button
                            onClick={() => setIsRouteModalOpen(false)}
                            className="w-full h-12 font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                            Close
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Location Update Modal */}
            <Modal isOpen={isLocationModalOpen} onClose={() => setIsLocationModalOpen(false)} title="Update E-Centre Location">
                <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                        Update your E-Centre location to help users find you:
                    </p>
                    
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Address
                        </label>
                        <input
                            type="text"
                            value={locationAddress}
                            onChange={(e) => setLocationAddress(e.target.value)}
                            placeholder="Enter your E-Centre address"
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:outline-none"
                        />
                    </div>

                    <Button
                        onClick={handleUseCurrentLocation}
                        className="w-full h-12 font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        <MapPin className="h-4 w-4 mr-2" />
                        Use My Current Location
                    </Button>

                    {locationCoords && (
                        <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                            <p className="text-xs font-semibold text-emerald-700 mb-1">Coordinates Set:</p>
                            <p className="text-xs text-emerald-600">
                                Lat: {locationCoords.lat.toFixed(6)}, Lng: {locationCoords.lng.toFixed(6)}
                            </p>
                        </div>
                    )}
                    
                    <Button
                        onClick={confirmLocationUpdate}
                        disabled={!locationAddress || !locationCoords}
                        className="w-full h-12 font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Confirm Location Update
                    </Button>
                </div>
            </Modal>
        </div>
    )
}
