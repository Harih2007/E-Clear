"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, MapPin, Edit, Trash2 } from "lucide-react"

export default function AdminDashboard() {
    const locations = [
        { id: 1, name: "City Center Mall", address: "101 Main St", status: "Active", capacity: "80%" },
        { id: 2, name: "Community Library", address: "55 Knowledge Way", status: "Active", capacity: "45%" },
        { id: 3, name: "Tech Park Block A", address: "8 Tech Blvd", status: "Full", capacity: "100%" },
    ]

    return (
        <div className="container py-8 px-4 max-w-screen-2xl">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                    <p className="text-muted-foreground">Manage drop-off locations and view system status.</p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Add Location
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Drop-off Locations</CardTitle>
                    <CardDescription>All registered e-waste collection points.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <div className="grid grid-cols-5 gap-4 p-4 font-medium border-b bg-secondary/50">
                            <div className="col-span-2">Name</div>
                            <div className="hidden md:block">Status</div>
                            <div className="hidden md:block">Capacity</div>
                            <div className="text-right">Actions</div>
                        </div>
                        {locations.map((loc) => (
                            <div key={loc.id} className="grid grid-cols-5 gap-4 p-4 items-center border-b last:border-0 hover:bg-accent/5 transition-colors">
                                <div className="col-span-2 font-medium">
                                    <div>{loc.name}</div>
                                    <div className="text-sm text-muted-foreground flex items-center md:hidden mt-1">{loc.status} • {loc.capacity}</div>
                                    <div className="text-sm text-muted-foreground hidden md:flex items-center mt-0.5"><MapPin className="h-3 w-3 mr-1" /> {loc.address}</div>
                                </div>
                                <div className="hidden md:flex items-center">
                                    <Badge variant={loc.status === "Full" ? "destructive" : "success"}>{loc.status}</Badge>
                                </div>
                                <div className="hidden md:flex items-center text-sm font-medium">
                                    {loc.capacity}
                                </div>
                                <div className="flex justify-end gap-2">
                                    <Button size="icon" variant="ghost"><Edit className="h-4 w-4" /></Button>
                                    <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
