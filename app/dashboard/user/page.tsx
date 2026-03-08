"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Leaf, MapPin, Smartphone, Battery, Laptop, CheckCircle, Clock, Trash2, Box, Users, Package } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { api, handleApiError } from "@/lib/api"
import { Modal } from "@/components/ui/modal"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { GoogleAutocomplete } from "@/components/ui/google-autocomplete"

// Dynamic Import for Map (Client Side Only)
const Map = dynamic(() => import("@/components/ui/map"), {
    loading: () => <div className="h-[400px] w-full bg-emerald-100 animate-pulse rounded-2xl" />,
    ssr: false
})

export default function UserDashboard() {
    const { user, isAuthenticated } = useAuth()
    const router = useRouter()

    const [requests, setRequests] = useState<any[]>([])
    const [stats, setStats] = useState({ totalPoints: 0, itemsRecycled: 0 })
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false)

    // User location state
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
    const [locationAddress, setLocationAddress] = useState("")

    const handleGooglePlaceSelect = (place: { address: string; lat: number; lng: number; pincode: string }) => {
        setUserLocation({ lat: place.lat, lng: place.lng })
        setLocationAddress(place.address)
        setFormData(prev => ({ 
            ...prev, 
            address: place.address, 
            pincode: place.pincode 
        }))
        generateNearbyECentres(place.lat, place.lng)
        setIsLocationModalOpen(false)
    }

    // Form State
    const [formData, setFormData] = useState({
        type: "LAPTOP",
        quantity: 1,
        address: "123 Green St",
        pincode: ""
    })

    // Fake E-centres data based on user location
    const [nearbyECentres, setNearbyECentres] = useState<any[]>([])

    // Generate fake E-centres near user location
    const generateNearbyECentres = (lat: number, lng: number) => {
        const centres = [
            {
                name: "Green Tech Recyclers",
                distance: "2.1 km",
                coordinates: { lat: lat + 0.015, lng: lng + 0.010 }
            },
            {
                name: "Eco Waste Solutions",
                distance: "3.5 km",
                coordinates: { lat: lat - 0.020, lng: lng + 0.025 }
            },
            {
                name: "Clean Earth E-Waste",
                distance: "4.8 km",
                coordinates: { lat: lat + 0.030, lng: lng - 0.015 }
            },
            {
                name: "Sustainable Recycling Hub",
                distance: "5.2 km",
                coordinates: { lat: lat - 0.025, lng: lng - 0.020 }
            }
        ]
        setNearbyECentres(centres)
    }

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/auth/login-user")
            return
        }
        // Check if user has correct role
        if ((user as any)?.role === "ECENTRE") {
            router.push("/dashboard/recycler")
            return
        }
        // Set pincode from user data if available
        if (user?.location) {
            const userPincode = (user.location as any).pincode || (user.location as any).zipCode || "";
            setFormData(prev => ({ ...prev, pincode: userPincode }));
            
            // Check if user has coordinates
            const coords = (user.location as any)?.coordinates;
            if (coords && coords.lat && coords.lng) {
                setUserLocation({ lat: coords.lat, lng: coords.lng });
                generateNearbyECentres(coords.lat, coords.lng);
            }
        }
        fetchData()
    }, [isAuthenticated, user])

    const fetchData = async () => {
        if (!user) return
        try {
            const res = await api.get(`/disposal/my-requests`)
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
            await api.post("/disposal/request", {
                items: [{ type: formData.type, quantity: Number(formData.quantity) }],
                address: formData.address,
                pincode: formData.pincode
            })
            setIsModalOpen(false)
            fetchData() // Refresh
        } catch (err) {
            alert(handleApiError(err))
        }
    }

    const handleLocationSelect = (location: string) => {
        // Predefined locations with coordinates and formatted addresses
        const locations: { [key: string]: { lat: number; lng: number; address: string; fullAddress: string; pincode: string } } = {
            "Delhi": { 
                lat: 28.6139, 
                lng: 77.2090, 
                address: "New Delhi, Delhi, India",
                fullAddress: "Connaught Place, New Delhi, Delhi 110001, India",
                pincode: "110001"
            },
            "Mumbai": { 
                lat: 19.0760, 
                lng: 72.8777, 
                address: "Mumbai, Maharashtra, India",
                fullAddress: "Gateway of India, Mumbai, Maharashtra 400001, India",
                pincode: "400001"
            },
            "Bangalore": { 
                lat: 12.9716, 
                lng: 77.5946, 
                address: "Bangalore, Karnataka, India",
                fullAddress: "MG Road, Bangalore, Karnataka 560001, India",
                pincode: "560001"
            },
            "Hyderabad": { 
                lat: 17.3850, 
                lng: 78.4867, 
                address: "Hyderabad, Telangana, India",
                fullAddress: "Charminar, Hyderabad, Telangana 500002, India",
                pincode: "500002"
            },
            "Chennai": { 
                lat: 13.0827, 
                lng: 80.2707, 
                address: "Chennai, Tamil Nadu, India",
                fullAddress: "Marina Beach, Chennai, Tamil Nadu 600001, India",
                pincode: "600001"
            },
            "Kolkata": { 
                lat: 22.5726, 
                lng: 88.3639, 
                address: "Kolkata, West Bengal, India",
                fullAddress: "Park Street, Kolkata, West Bengal 700016, India",
                pincode: "700016"
            }
        }

        const selectedLocation = locations[location]
        if (selectedLocation) {
            setUserLocation({ lat: selectedLocation.lat, lng: selectedLocation.lng })
            setLocationAddress(selectedLocation.address)
            setFormData(prev => ({ ...prev, address: selectedLocation.fullAddress, pincode: selectedLocation.pincode }))
            generateNearbyECentres(selectedLocation.lat, selectedLocation.lng)
            setIsLocationModalOpen(false)
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

    if (loading) return (
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 flex items-center justify-center">
            <div className="text-emerald-700 text-lg">Loading your dashboard...</div>
        </div>
    )

    return (
        <>
            {/* Background overlay to hide grid */}
            <div className="fixed inset-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 z-[-1]" />
            
            <div className="relative min-h-screen">
                {/* Header */}
                <div className="bg-white/80 backdrop-blur-sm border-b border-emerald-100 sticky top-0 z-10">
                <div className="container mx-auto px-6 py-4 max-w-5xl">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-emerald-900 flex items-center gap-2">
                                <Leaf className="h-6 w-6 text-emerald-600" />
                                Welcome back, {user?.name}
                            </h1>
                            <p className="text-emerald-600 text-sm mt-1">Manage your e-waste pickups</p>
                        </div>
                        <Button 
                            className="gap-2 h-11 px-6 font-semibold rounded-xl transition-all hover:shadow-lg bg-emerald-600 hover:bg-emerald-700 text-white border-0" 
                            onClick={() => setIsModalOpen(true)}>
                            <Package className="h-4 w-4" /> Request Pickup
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-6 py-8 max-w-5xl space-y-6">
                
                {/* Map Section */}
                <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-emerald-100 relative z-0">
                    <div className="p-5 border-b border-emerald-100 bg-emerald-50/50 flex justify-between items-center">
                        <div>
                            <div className="flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-emerald-600" />
                                <h2 className="text-lg font-semibold text-emerald-900">Nearby E-Centres</h2>
                            </div>
                            <p className="text-sm text-emerald-600 mt-1">
                                {locationAddress || "Select your location to see nearby centers"}
                            </p>
                        </div>
                        <Button 
                            onClick={() => setIsLocationModalOpen(true)}
                            className="h-9 px-4 text-sm font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white border-0 relative z-10">
                            {userLocation ? "Change Location" : "Set Location"}
                        </Button>
                    </div>
                    <div className="h-[400px] relative z-0">
                        <Map 
                            userLocation={userLocation || undefined}
                            eCentres={nearbyECentres}
                        />
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid sm:grid-cols-3 gap-4">
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-emerald-100">
                        <div className="text-xs text-emerald-600 font-semibold uppercase tracking-wide mb-2">Pickup Requests</div>
                        <div className="text-3xl font-bold text-emerald-900 mb-1">{requests.length}</div>
                        <div className="text-xs text-gray-500">Total submitted</div>
                    </div>
                    
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-emerald-100">
                        <div className="text-xs text-emerald-600 font-semibold uppercase tracking-wide mb-2">Eco-Points</div>
                        <div className="text-3xl font-bold text-emerald-900 mb-1">{user?.points || 0}</div>
                        <div className="text-xs text-gray-500">Available rewards</div>
                    </div>

                    <div className="bg-white rounded-xl p-5 shadow-sm border border-emerald-100">
                        <div className="text-xs text-emerald-600 font-semibold uppercase tracking-wide mb-2">Items Recycled</div>
                        <div className="text-3xl font-bold text-emerald-900 mb-1">{stats.itemsRecycled}</div>
                        <div className="text-xs text-gray-500">Environmental impact</div>
                    </div>
                </div>

                {/* Pickup Request Card */}
                <div className="bg-white rounded-2xl shadow-md border border-emerald-100 overflow-hidden">
                    <div className="p-5 border-b border-emerald-100 bg-emerald-50/50">
                        <div className="flex items-center gap-2">
                            <Package className="h-5 w-5 text-emerald-600" />
                            <h2 className="text-lg font-semibold text-emerald-900">Pickup Status</h2>
                        </div>
                        <p className="text-sm text-emerald-600 mt-1">Track your e-waste collection requests</p>
                    </div>
                    <div className="p-5">
                        <div className="space-y-3">
                            {requests.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-50 flex items-center justify-center">
                                        <Trash2 className="h-8 w-8 text-emerald-300" />
                                    </div>
                                    <p className="text-gray-600 font-medium">No pickup requests yet</p>
                                    <p className="text-sm text-gray-500 mt-1">Schedule your first pickup to get started</p>
                                </div>
                            ) : (
                                requests.map((req, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-emerald-100 bg-emerald-50/30 hover:bg-emerald-50/50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                                                {getIcon(req.items[0].type)}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-emerald-900">{req.items[0].type}</p>
                                                <p className="text-sm text-gray-600">Qty: {req.items[0].quantity} • ID: {req._id.slice(-6)}</p>
                                                {req.status === "GROUPING" && req.groupingProgress && (
                                                    <p className="text-xs text-emerald-600 mt-1 font-medium">
                                                        {req.groupingProgress.current}/{req.groupingProgress.target} households grouped
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className={`px-3 py-1.5 rounded-lg font-semibold text-xs ${
                                            req.status === "COLLECTED" ? "bg-emerald-100 text-emerald-700" :
                                            req.status === "SCHEDULED" ? "bg-blue-100 text-blue-700" :
                                            req.status === "GROUPING" ? "bg-amber-100 text-amber-700" :
                                            "bg-gray-100 text-gray-600"
                                        }`}>
                                            {req.status}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Grouping Progress Card */}
                {requests.some(r => r.status === "GROUPING") && (
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl shadow-md border border-emerald-200 p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Users className="h-5 w-5 text-emerald-600" />
                            <h3 className="text-lg font-semibold text-emerald-900">Shared Pickup Progress</h3>
                        </div>
                        <div className="mb-4">
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-emerald-700 font-medium">Households in your area</span>
                                <span className="font-bold text-emerald-900">
                                    {requests.find(r => r.status === "GROUPING")?.groupingProgress?.current || 0}/
                                    {requests.find(r => r.status === "GROUPING")?.groupingProgress?.target || 5}
                                </span>
                            </div>
                            <div className="h-3 rounded-full overflow-hidden bg-emerald-100">
                                <div 
                                    className="h-full rounded-full bg-emerald-500 transition-all duration-500" 
                                    style={{ 
                                        width: `${((requests.find(r => r.status === "GROUPING")?.groupingProgress?.current || 0) / 5) * 100}%`
                                    }}
                                />
                            </div>
                        </div>
                        <p className="text-sm text-emerald-700 leading-relaxed">
                            {5 - (requests.find(r => r.status === "GROUPING")?.groupingProgress?.current || 0)} more households needed for shared pickup scheduling.
                        </p>
                    </div>
                )}

                {/* Pickup Location Card */}
                <div className="bg-white rounded-2xl shadow-md border border-emerald-100 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <MapPin className="h-5 w-5 text-emerald-600" />
                        <h3 className="text-lg font-semibold text-emerald-900">Pickup Location</h3>
                    </div>
                    {formData.address && formData.address !== "123 Green St" ? (
                        <>
                            <p className="text-gray-700 mb-2 leading-relaxed">{formData.address}</p>
                            <p className="text-sm text-emerald-600">Pincode: {formData.pincode || 'Not set'}</p>
                        </>
                    ) : (
                        <div className="text-center py-4">
                            <p className="text-gray-500 mb-3">No location selected</p>
                            <Button 
                                onClick={() => setIsLocationModalOpen(true)}
                                className="h-9 px-4 text-sm font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white border-0">
                                Set Location
                            </Button>
                        </div>
                    )}
                </div>

                {/* Estimated Incentive Card */}
                <div className="bg-white rounded-2xl shadow-md border border-emerald-100 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <CheckCircle className="h-5 w-5 text-emerald-600" />
                        <h3 className="text-lg font-semibold text-emerald-900">Estimated Incentive</h3>
                    </div>
                    <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-3xl font-bold text-emerald-700">₹50 - ₹200</span>
                        <span className="text-sm text-gray-500">(range)</span>
                    </div>
                    <p className="text-sm text-emerald-600">Based on your next pickup items</p>
                </div>

                {/* Pickup History */}
                {requests.filter(r => r.status === "COLLECTED").length > 0 && (
                    <div className="bg-white rounded-2xl shadow-md border border-emerald-100 overflow-hidden">
                        <div className="p-5 border-b border-emerald-100 bg-emerald-50/50">
                            <div className="flex items-center gap-2">
                                <Clock className="h-5 w-5 text-emerald-600" />
                                <h2 className="text-lg font-semibold text-emerald-900">Pickup History</h2>
                            </div>
                        </div>
                        <div className="p-5">
                            <div className="space-y-3">
                                {requests.filter(r => r.status === "COLLECTED").map((req, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-gray-200 bg-gray-50">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
                                                {getIcon(req.items[0].type)}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{req.items[0].type}</p>
                                                <p className="text-xs text-gray-500">
                                                    {new Date(req.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <CheckCircle className="h-5 w-5 text-emerald-600" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

            </div>

            {/* Request Pickup Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Request Pickup">
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-emerald-900">Item Type</label>
                        <select
                            className="flex h-12 w-full rounded-xl border border-emerald-200 px-4 py-2 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-gray-900"
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        >
                            <option value="LAPTOP">Laptop</option>
                            <option value="PHONE">Phone</option>
                            <option value="BATTERY">Battery</option>
                            <option value="CHARGER">Charger</option>
                            <option value="TABLET">Tablet</option>
                            <option value="MONITOR">Monitor</option>
                            <option value="OTHER">Other</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-emerald-900">Quantity</label>
                        <Input
                            type="number"
                            min="1"
                            className="h-12 rounded-xl border-emerald-200 focus:ring-emerald-500"
                            value={formData.quantity}
                            onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                        />
                    </div>
                    <Button 
                        type="submit" 
                        className="w-full h-12 font-semibold rounded-xl transition-all hover:shadow-lg bg-emerald-600 hover:bg-emerald-700 text-white border-0">
                        Submit Request
                    </Button>
                </form>
            </Modal>

            {/* Location Selection Modal */}
            <Modal isOpen={isLocationModalOpen} onClose={() => setIsLocationModalOpen(false)} title="Search for your location">
                <div className="space-y-4">
                    {/* Google Autocomplete Search */}
                    <GoogleAutocomplete 
                        onPlaceSelect={handleGooglePlaceSelect}
                        placeholder="Search for area, street name, landmark..."
                    />
                    
                    <p className="text-xs text-gray-500 text-center">
                        Type your address and select from the dropdown suggestions
                    </p>
                </div>
            </Modal>
            </div>
        </>
    )
}
