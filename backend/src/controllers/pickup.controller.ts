import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { supabase } from "../config/supabase";

// Haversine formula
const haversineDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// Schedule Pickup (E-Centre only)
export const schedulePickup = async (req: AuthRequest, res: Response) => {
    try {
        if (req.user?.role !== "ECENTRE") {
            return res.status(403).json({ error: "Only E-Centres can schedule pickups" });
        }

        const { requestId, scheduledDate, scheduledTimeStart, scheduledTimeEnd, vehicleType } = req.body;

        if (!requestId) {
            return res.status(400).json({ error: "Request ID is required" });
        }

        // Verify request belongs to this E-Centre
        const { data: request, error: reqError } = await supabase
            .from('disposal_requests')
            .select('*')
            .eq('id', requestId)
            .single();

        if (reqError || !request) {
            return res.status(404).json({ error: "Disposal request not found" });
        }

        if (request.ecentre_id !== req.user._id) {
            return res.status(403).json({ error: "Not authorized for this request" });
        }

        // Create pickup
        const { data: pickup, error } = await supabase
            .from('pickups')
            .insert({
                ecentre_id: req.user._id,
                request_ids: [requestId],
                area_pincode: request.location_pincode,
                area_lat: request.location_lat || 0,
                area_lng: request.location_lng || 0,
                area_radius: 2,
                status: 'SCHEDULED',
                scheduled_date: scheduledDate || new Date().toISOString(),
                scheduled_time_start: scheduledTimeStart || "09:00",
                scheduled_time_end: scheduledTimeEnd || "17:00",
                vehicle_type: vehicleType || 'TWO_WHEELER',
                items_summary: request.items,
                household_count: 1
            })
            .select()
            .single();

        if (error) throw error;

        // Update request status
        await supabase
            .from('disposal_requests')
            .update({
                status: 'SCHEDULED',
                scheduled_pickup_id: pickup.id,
                updated_at: new Date().toISOString()
            })
            .eq('id', requestId);

        res.json({
            success: true,
            data: {
                _id: pickup.id,
                ...pickup
            }
        });
    } catch (error: any) {
        console.error("Schedule pickup error:", error);
        res.status(500).json({ error: "Failed to schedule pickup" });
    }
};

// Mark Pickup as Collected (E-Centre only)
export const markAsCollected = async (req: AuthRequest, res: Response) => {
    try {
        if (req.user?.role !== "ECENTRE") {
            return res.status(403).json({ error: "Only E-Centres can mark pickups" });
        }

        const { requestId } = req.params;

        // Get the request
        const { data: request } = await supabase
            .from('disposal_requests')
            .select('*')
            .eq('id', requestId)
            .single();

        if (!request) {
            return res.status(404).json({ error: "Request not found" });
        }

        if (request.ecentre_id !== req.user._id) {
            return res.status(403).json({ error: "Not authorized" });
        }

        // Update request to COLLECTED
        await supabase
            .from('disposal_requests')
            .update({
                status: 'COLLECTED',
                actual_incentive: request.estimated_incentive_min,
                updated_at: new Date().toISOString()
            })
            .eq('id', requestId);

        // Update pickup if exists
        if (request.scheduled_pickup_id) {
            await supabase
                .from('pickups')
                .update({
                    status: 'COMPLETED',
                    completed_at: new Date().toISOString()
                })
                .eq('id', request.scheduled_pickup_id);
        }

        // Add incentive points to user
        try {
            const { data: user } = await supabase
                .from('users')
                .select('points')
                .eq('id', request.user_id)
                .single();
            if (user) {
                await supabase
                    .from('users')
                    .update({ points: (user.points || 0) + (request.estimated_incentive_min || 10) })
                    .eq('id', request.user_id);
            }
        } catch (e) {
            console.error("Failed to update user points:", e);
        }

        // Increment E-Centre completed pickups
        const { data: eCentre } = await supabase
            .from('ecentres')
            .select('completed_pickups')
            .eq('id', req.user._id)
            .single();

        if (eCentre) {
            await supabase
                .from('ecentres')
                .update({ completed_pickups: (eCentre.completed_pickups || 0) + 1 })
                .eq('id', req.user._id);
        }

        res.json({ success: true, message: "Marked as collected" });
    } catch (error: any) {
        console.error("Mark collected error:", error);
        res.status(500).json({ error: "Failed to mark as collected" });
    }
};

// Get E-Centre Stats
export const getECentreStats = async (req: AuthRequest, res: Response) => {
    try {
        if (req.user?.role !== "ECENTRE") {
            return res.status(403).json({ error: "Access denied" });
        }

        const { data: requests } = await supabase
            .from('disposal_requests')
            .select('*')
            .eq('ecentre_id', req.user._id);

        const allRequests = requests || [];
        const pending = allRequests.filter(r => r.status === 'PENDING' || r.status === 'GROUPING');
        const scheduled = allRequests.filter(r => r.status === 'SCHEDULED');
        const collected = allRequests.filter(r => r.status === 'COLLECTED');

        res.json({
            success: true,
            data: {
                totalRequests: allRequests.length,
                pendingRequests: pending.length,
                scheduledPickups: scheduled.length,
                completedPickups: collected.length,
                totalItemsProcessed: collected.reduce((sum: number, r: any) => {
                    return sum + (r.items as any[]).reduce((s: number, i: any) => s + i.quantity, 0);
                }, 0)
            }
        });
    } catch (error: any) {
        console.error("Get E-Centre stats error:", error);
        res.status(500).json({ error: "Failed to fetch stats" });
    }
};

// Get User Stats
export const getUserStats = async (req: AuthRequest, res: Response) => {
    try {
        if (req.user?.role !== "USER") {
            return res.status(403).json({ error: "Access denied" });
        }

        const { data: requests } = await supabase
            .from('disposal_requests')
            .select('*')
            .eq('user_id', req.user._id);

        const allRequests = requests || [];
        const { data: user } = await supabase
            .from('users')
            .select('points')
            .eq('id', req.user._id)
            .single();

        res.json({
            success: true,
            data: {
                totalRequests: allRequests.length,
                activeRequests: allRequests.filter(r => ['PENDING', 'GROUPING', 'ACCEPTED', 'SCHEDULED'].includes(r.status)).length,
                completedRequests: allRequests.filter(r => r.status === 'COLLECTED').length,
                totalPoints: user?.points || 0
            }
        });
    } catch (error: any) {
        console.error("Get user stats error:", error);
        res.status(500).json({ error: "Failed to fetch stats" });
    }
};

// Get Pending Pools (E-Centre)
export const getPendingPools = async (req: AuthRequest, res: Response) => {
    try {
        if (req.user?.role !== "ECENTRE") {
            return res.status(403).json({ error: "Access denied" });
        }

        const { data: pools, error } = await supabase
            .from('pickup_pools')
            .select('*')
            .eq('ecentre_id', req.user._id)
            .in('status', ['OPEN', 'ACCEPTED'])
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.json({ success: true, data: pools || [] });
    } catch (error: any) {
        console.error("Get pending pools error:", error);
        res.status(400).json({ success: false, error: error.message });
    }
};

// Get Nearby E-Centres (by pincode)
export const getNearbyECentres = async (req: AuthRequest, res: Response) => {
    try {
        if (req.user?.role !== "USER") {
            return res.status(403).json({ error: "Access denied" });
        }

        const { pincode } = req.query;

        let query = supabase
            .from('ecentres')
            .select('id, name, location_address, location_lat, location_lng, rating, completed_pickups')
            .limit(10);

        if (pincode) {
            query = query.contains('service_areas', [pincode as string]);
        }

        const { data: eCentres, error } = await query;
        if (error) throw error;

        res.json({ success: true, data: eCentres || [] });
    } catch (error: any) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Get Nearby E-Centres by Coordinates
export const getNearbyECentresByCoords = async (req: AuthRequest, res: Response) => {
    try {
        const { lat, lng, radius } = req.query;

        if (!lat || !lng) {
            return res.status(400).json({ success: false, error: "lat and lng are required" });
        }

        const userLat = parseFloat(lat as string);
        const userLng = parseFloat(lng as string);
        const searchRadius = parseFloat(radius as string) || 50;

        if (isNaN(userLat) || isNaN(userLng)) {
            return res.status(400).json({ success: false, error: "Invalid coordinates" });
        }

        const { data: eCentres } = await supabase
            .from('ecentres')
            .select('id, name, location_address, location_lat, location_lng, rating, completed_pickups, service_radius, operational_status, phone_number')
            .neq('operational_status', 'INACTIVE');

        const nearbyECentres = (eCentres || [])
            .map(ec => {
                if (!ec.location_lat || !ec.location_lng) return null;
                const distance = haversineDistance(userLat, userLng, ec.location_lat, ec.location_lng);
                if (distance > searchRadius) return null;
                return {
                    _id: ec.id,
                    name: ec.name,
                    location: {
                        address: ec.location_address,
                        coordinates: { lat: ec.location_lat, lng: ec.location_lng }
                    },
                    rating: ec.rating,
                    completedPickups: ec.completed_pickups,
                    operationalStatus: ec.operational_status,
                    phoneNumber: ec.phone_number,
                    distance: Math.round(distance * 10) / 10,
                    distanceDisplay: distance < 1 ? `${Math.round(distance * 1000)}m` : `${(Math.round(distance * 10) / 10).toFixed(1)} km`
                };
            })
            .filter(Boolean)
            .sort((a: any, b: any) => a.distance - b.distance)
            .slice(0, 20);

        res.json({ success: true, data: nearbyECentres });
    } catch (error: any) {
        console.error("Get nearby E-Centres by coords error:", error);
        res.status(500).json({ success: false, error: "Failed to fetch nearby E-Centres" });
    }
};
