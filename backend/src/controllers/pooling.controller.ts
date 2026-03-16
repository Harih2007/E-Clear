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

// Find nearest E-Centre
export const findNearestECentre = async (pincode: string, coordinates?: { lat: number; lng: number }) => {
    if (coordinates && coordinates.lat && coordinates.lng) {
        const { data: eCentres } = await supabase
            .from('ecentres')
            .select('*')
            .neq('operational_status', 'INACTIVE');

        if (!eCentres || eCentres.length === 0) return null;

        let nearest: any = null;
        let minDist = Infinity;

        // First pass: within service radius
        for (const ec of eCentres) {
            if (ec.location_lat && ec.location_lng) {
                const dist = haversineDistance(coordinates.lat, coordinates.lng, ec.location_lat, ec.location_lng);
                const maxRadius = ec.service_radius || 10;
                if (dist <= maxRadius && dist < minDist) {
                    minDist = dist;
                    nearest = ec;
                }
            }
        }
        if (nearest) return nearest;

        // Fallback: absolute nearest
        for (const ec of eCentres) {
            if (ec.location_lat && ec.location_lng) {
                const dist = haversineDistance(coordinates.lat, coordinates.lng, ec.location_lat, ec.location_lng);
                if (dist < minDist) {
                    minDist = dist;
                    nearest = ec;
                }
            }
        }
        return nearest;
    }

    // Fallback: pincode match
    const { data: byPincode } = await supabase
        .from('ecentres')
        .select('*')
        .contains('service_areas', [pincode])
        .neq('operational_status', 'INACTIVE')
        .order('completed_pickups', { ascending: false })
        .limit(1);

    if (byPincode && byPincode.length > 0) return byPincode[0];

    const { data: any } = await supabase
        .from('ecentres')
        .select('*')
        .neq('operational_status', 'INACTIVE')
        .order('completed_pickups', { ascending: false })
        .limit(1);

    return any && any.length > 0 ? any[0] : null;
};

// Find or create pool
export const findOrCreatePool = async (pincode: string, eCentreId: string) => {
    // Look for existing open pool
    const { data: existingPool } = await supabase
        .from('pickup_pools')
        .select('*')
        .eq('area', pincode)
        .eq('ecentre_id', eCentreId)
        .eq('status', 'OPEN')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

    if (existingPool && existingPool.current_count < existingPool.max_capacity) {
        return existingPool;
    }

    // Create new pool
    const { data: newPool, error } = await supabase
        .from('pickup_pools')
        .insert({
            ecentre_id: eCentreId,
            area: pincode,
            max_capacity: 5,
            current_count: 0,
            status: 'OPEN',
            items_summary: []
        })
        .select()
        .single();

    if (error) throw error;
    return newPool;
};

// Update pool summary
export const updatePoolSummary = async (poolId: string) => {
    const { data: pool } = await supabase
        .from('pickup_pools')
        .select('*')
        .eq('id', poolId)
        .single();

    if (!pool) return;

    const requestIds = pool.request_ids || [];
    if (requestIds.length === 0) return;

    const { data: requests } = await supabase
        .from('disposal_requests')
        .select('items')
        .in('id', requestIds);

    if (!requests) return;

    const summary: { [key: string]: number } = {};
    for (const req of requests) {
        const items = req.items as any[];
        for (const item of items) {
            summary[item.type] = (summary[item.type] || 0) + item.quantity;
        }
    }

    const itemsSummary = Object.entries(summary).map(([type, quantity]) => ({ type, quantity }));

    await supabase
        .from('pickup_pools')
        .update({
            items_summary: itemsSummary,
            updated_at: new Date().toISOString()
        })
        .eq('id', poolId);
};

// Accept Pool (E-Centre)
export const acceptPool = async (req: AuthRequest, res: Response) => {
    try {
        if (req.user?.role !== "ECENTRE") {
            return res.status(403).json({ error: "Only E-Centres can accept pools" });
        }

        const { poolId } = req.params;

        const { data: pool, error } = await supabase
            .from('pickup_pools')
            .select('*')
            .eq('id', poolId)
            .single();

        if (error || !pool) {
            return res.status(404).json({ error: "Pool not found" });
        }

        if (pool.ecentre_id !== req.user._id) {
            return res.status(403).json({ error: "Not authorized for this pool" });
        }

        // Update pool status
        await supabase
            .from('pickup_pools')
            .update({ status: 'ACCEPTED', updated_at: new Date().toISOString() })
            .eq('id', poolId);

        // Update all requests in the pool
        if (pool.request_ids && pool.request_ids.length > 0) {
            await supabase
                .from('disposal_requests')
                .update({ status: 'ACCEPTED', updated_at: new Date().toISOString() })
                .in('id', pool.request_ids);
        }

        res.json({ success: true, message: "Pool accepted" });
    } catch (error: any) {
        console.error("Accept pool error:", error);
        res.status(500).json({ error: "Failed to accept pool" });
    }
};
