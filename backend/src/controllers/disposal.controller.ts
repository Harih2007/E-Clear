import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { supabase } from "../config/supabase";
import { findNearestECentre, findOrCreatePool, updatePoolSummary } from "./pooling.controller";

// Incentive rates
const INCENTIVE_RATES: { [key: string]: { min: number; max: number } } = {
    PHONE: { min: 50, max: 200 },
    CHARGER: { min: 10, max: 30 },
    BATTERY: { min: 20, max: 80 },
    LAPTOP: { min: 200, max: 800 },
    TABLET: { min: 100, max: 400 },
    MONITOR: { min: 150, max: 500 },
    OTHER: { min: 10, max: 100 },
};

const calculateIncentive = (items: { type: string; quantity: number }[]) => {
    let min = 0, max = 0;
    for (const item of items) {
        const rate = INCENTIVE_RATES[item.type] || INCENTIVE_RATES.OTHER;
        min += rate.min * item.quantity;
        max += rate.max * item.quantity;
    }
    return { min, max };
};

// Create Disposal Request
export const createDisposalRequest = async (req: AuthRequest, res: Response) => {
    try {
        if (req.user?.role !== "USER") {
            return res.status(403).json({ error: "Only users can create disposal requests" });
        }

        const { items, address, pincode, coordinates, description, imageUrl } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: "Items are required" });
        }
        if (!address || !pincode) {
            return res.status(400).json({ error: "Address and pincode are required" });
        }

        // Allow multiple requests - removed the active request check
        // Users can now submit multiple pickup requests

        const estimatedIncentive = calculateIncentive(items);

        // Find nearest E-Centre
        const eCentre = await findNearestECentre(pincode, coordinates);
        if (!eCentre) {
            return res.status(404).json({ error: "No E-Centre available in your area yet." });
        }

        // Find or create pool
        const pool = await findOrCreatePool(pincode, eCentre.id);

        // Create request
        const { data: request, error } = await supabase
            .from('disposal_requests')
            .insert({
                user_id: req.user._id,
                ecentre_id: eCentre.id,
                pool_id: pool.id,
                items,
                location_address: address,
                location_pincode: pincode,
                location_lat: coordinates?.lat || null,
                location_lng: coordinates?.lng || null,
                description,
                image_url: imageUrl,
                status: pool.current_count > 0 ? 'GROUPING' : 'PENDING',
                estimated_incentive_min: estimatedIncentive.min,
                estimated_incentive_max: estimatedIncentive.max,
                grouping_current: pool.current_count + 1,
                grouping_target: pool.max_capacity
            })
            .select()
            .single();

        if (error) throw error;

        // Update pool
        const newRequestIds = [...(pool.request_ids || []), request.id];
        await supabase
            .from('pickup_pools')
            .update({
                request_ids: newRequestIds,
                current_count: newRequestIds.length,
                updated_at: new Date().toISOString()
            })
            .eq('id', pool.id);

        // Update pool summary
        await updatePoolSummary(pool.id);

        // Update grouping progress for all requests in pool
        if (newRequestIds.length > 1) {
            await supabase
                .from('disposal_requests')
                .update({
                    status: 'GROUPING',
                    grouping_current: newRequestIds.length,
                    updated_at: new Date().toISOString()
                })
                .in('id', newRequestIds);
        }

        // Add to user points
        const { data: currentUser } = await supabase
            .from('users')
            .select('points')
            .eq('id', req.user._id)
            .single();

        await supabase
            .from('users')
            .update({ points: (currentUser?.points || 0) + 10 })
            .eq('id', req.user._id);

        res.status(201).json({
            success: true,
            data: {
                ...request,
                eCentreName: eCentre.name,
                poolId: pool.id,
                grouping: { current: newRequestIds.length, target: pool.max_capacity }
            }
        });
    } catch (error: any) {
        console.error("Create disposal request error:", error);
        res.status(500).json({ error: "Failed to create disposal request" });
    }
};

// Get User's Disposal Requests
export const getUserRequests = async (req: AuthRequest, res: Response) => {
    try {
        if (req.user?.role !== "USER") {
            return res.status(403).json({ error: "Only users can view their requests" });
        }

        const { data: requests, error } = await supabase
            .from('disposal_requests')
            .select('*')
            .eq('user_id', req.user._id)
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Fetch E-Centre details for scheduled/collected requests
        const formattedRequests = await Promise.all((requests || []).map(async (r) => {
            let pickupPerson = null;
            
            // If request is scheduled or collected, get pickup person details
            if ((r.status === 'SCHEDULED' || r.status === 'COLLECTED')) {
                // First check if there's an assigned pickup person
                if (r.assigned_pickup_person) {
                    pickupPerson = r.assigned_pickup_person;
                } else if (r.ecentre_id) {
                    // Fallback to E-Centre details if no specific person assigned
                    const { data: eCentre } = await supabase
                        .from('ecentres')
                        .select('name, phone_number')
                        .eq('id', r.ecentre_id)
                        .single();
                    
                    if (eCentre) {
                        pickupPerson = {
                            name: eCentre.name,
                            phoneNumber: eCentre.phone_number
                        };
                    }
                }
            }

            return {
                _id: r.id,
                userId: r.user_id,
                eCentreId: r.ecentre_id,
                poolId: r.pool_id,
                items: r.items,
                location: {
                    address: r.location_address,
                    pincode: r.location_pincode,
                    coordinates: r.location_lat ? { lat: r.location_lat, lng: r.location_lng } : undefined
                },
                imageUrl: r.image_url,
                description: r.description,
                status: r.status,
                estimatedIncentive: { min: r.estimated_incentive_min, max: r.estimated_incentive_max },
                actualIncentive: r.actual_incentive,
                groupingProgress: { current: r.grouping_current, target: r.grouping_target },
                pickupPerson,
                createdAt: r.created_at,
                updatedAt: r.updated_at
            };
        }));

        res.json({ success: true, data: formattedRequests });
    } catch (error: any) {
        console.error("Get user requests error:", error);
        res.status(500).json({ error: "Failed to fetch requests" });
    }
};

// Get specific disposal request
export const getDisposalRequest = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        const { data: request, error } = await supabase
            .from('disposal_requests')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !request) {
            return res.status(404).json({ error: "Request not found" });
        }

        // Privacy check
        if (req.user?.role === "USER" && request.user_id !== req.user._id) {
            return res.status(403).json({ error: "Access denied" });
        }

        res.json({ success: true, data: request });
    } catch (error: any) {
        console.error("Get request error:", error);
        res.status(500).json({ error: "Failed to fetch request" });
    }
};

// Get All Requests (E-Centre only)
export const getAllRequests = async (req: AuthRequest, res: Response) => {
    try {
        if (req.user?.role !== "ECENTRE") {
            return res.status(403).json({ success: false, error: "Only E-Centres can view all requests" });
        }

        // Return requests assigned to this E-Centre
        const { data: requests, error } = await supabase
            .from('disposal_requests')
            .select('*')
            .eq('ecentre_id', req.user._id)
            .order('created_at', { ascending: false })
            .limit(100);

        if (error) throw error;

        // Fetch user details for each request
        const formattedRequests = await Promise.all((requests || []).map(async (r) => {
            let userDetails = null;
            
            // Fetch user name and phone number
            if (r.user_id) {
                const { data: user } = await supabase
                    .from('users')
                    .select('name, phone_number')
                    .eq('id', r.user_id)
                    .single();
                
                if (user) {
                    userDetails = {
                        name: user.name,
                        phoneNumber: user.phone_number
                    };
                }
            }

            return {
                _id: r.id,
                userId: r.user_id,
                eCentreId: r.ecentre_id,
                poolId: r.pool_id,
                items: r.items,
                location: {
                    address: r.location_address,
                    pincode: r.location_pincode,
                    coordinates: r.location_lat ? { lat: r.location_lat, lng: r.location_lng } : undefined
                },
                status: r.status,
                estimatedIncentive: { min: r.estimated_incentive_min, max: r.estimated_incentive_max },
                groupingProgress: { current: r.grouping_current, target: r.grouping_target },
                userDetails,
                createdAt: r.created_at,
                updatedAt: r.updated_at
            };
        }));

        res.json({ success: true, data: formattedRequests });
    } catch (error: any) {
        console.error("Get all requests error:", error);
        res.status(500).json({ success: false, error: "Failed to fetch requests" });
    }
};

// Get Reports by E-Centre
export const getReportsByECentre = async (req: AuthRequest, res: Response) => {
    try {
        if (req.user?.role !== "ECENTRE") {
            return res.status(403).json({ success: false, error: "Only E-Centres can view their reports" });
        }

        const { eCentreId } = req.params;
        if (eCentreId !== req.user._id) {
            return res.status(403).json({ success: false, error: "You can only view your own reports" });
        }

        const { data: requests, error } = await supabase
            .from('disposal_requests')
            .select('*')
            .eq('ecentre_id', eCentreId)
            .order('created_at', { ascending: false })
            .limit(100);

        if (error) throw error;

        res.json({ success: true, data: requests || [] });
    } catch (error: any) {
        console.error("Get reports by E-Centre error:", error);
        res.status(500).json({ success: false, error: "Failed to fetch reports" });
    }
};

// Get Reports by Location
export const getReportsByLocation = async (req: AuthRequest, res: Response) => {
    try {
        const { lat, lng, radius } = req.query;
        if (!lat || !lng) {
            return res.status(400).json({ success: false, error: "lat and lng are required" });
        }

        const userLat = parseFloat(lat as string);
        const userLng = parseFloat(lng as string);
        const searchRadius = parseFloat(radius as string) || 10;

        const { data: allRequests } = await supabase
            .from('disposal_requests')
            .select('*')
            .not('location_lat', 'is', null)
            .not('location_lng', 'is', null)
            .order('created_at', { ascending: false });

        const haversine = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
            const R = 6371;
            const dLat = (lat2 - lat1) * Math.PI / 180;
            const dLng = (lng2 - lng1) * Math.PI / 180;
            const a = Math.sin(dLat / 2) ** 2 +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLng / 2) ** 2;
            return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        };

        const nearby = (allRequests || []).filter(r => {
            if (!r.location_lat || !r.location_lng) return false;
            return haversine(userLat, userLng, r.location_lat, r.location_lng) <= searchRadius;
        });

        res.json({ success: true, data: nearby });
    } catch (error: any) {
        console.error("Get reports by location error:", error);
        res.status(500).json({ success: false, error: "Failed to fetch reports" });
    }
};

// Update Disposal Request Status (E-Centre only)
export const updateDisposalStatus = async (req: AuthRequest, res: Response) => {
    try {
        console.log('=== UPDATE DISPOSAL STATUS ===');
        console.log('User:', req.user);
        console.log('Request ID:', req.params.id);
        console.log('Body:', req.body);
        
        if (req.user?.role !== "ECENTRE") {
            return res.status(403).json({ success: false, error: "Only E-Centres can update request status" });
        }

        const { id } = req.params;
        const { status, assignedPickupPerson } = req.body;

        if (!status) {
            return res.status(400).json({ success: false, error: "Status is required" });
        }

        // Verify request belongs to this E-Centre
        const { data: request, error: reqError } = await supabase
            .from('disposal_requests')
            .select('*')
            .eq('id', id)
            .single();

        if (reqError || !request) {
            return res.status(404).json({ success: false, error: "Request not found" });
        }

        if (request.ecentre_id !== req.user._id) {
            return res.status(403).json({ success: false, error: "Not authorized for this request" });
        }

        // Prepare update data
        const updateData: any = {
            status,
            updated_at: new Date().toISOString()
        };

        // If assigning a pickup person, add it to the update
        if (assignedPickupPerson) {
            console.log('Adding assigned pickup person:', assignedPickupPerson);
            updateData.assigned_pickup_person = assignedPickupPerson;
        }

        console.log('Update data:', updateData);

        // Update status
        const { error: updateError } = await supabase
            .from('disposal_requests')
            .update(updateData)
            .eq('id', id);

        if (updateError) {
            console.error('Supabase update error:', updateError);
            throw updateError;
        }

        console.log('Update successful!');

        // If marking as collected, add incentive points to user
        if (status === 'COLLECTED') {
            const { data: user } = await supabase
                .from('users')
                .select('points')
                .eq('id', request.user_id)
                .single();
            
            if (user) {
                await supabase
                    .from('users')
                    .update({ 
                        points: (user.points || 0) + (request.estimated_incentive_min || 10) 
                    })
                    .eq('id', request.user_id);
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
                    .update({ 
                        completed_pickups: (eCentre.completed_pickups || 0) + 1 
                    })
                    .eq('id', req.user._id);
            }
        }

        res.json({ success: true, message: `Status updated to ${status}` });
    } catch (error: any) {
        console.error("Update disposal status error:", error);
        res.status(500).json({ success: false, error: "Failed to update status" });
    }
};

// Delete Disposal Request (User only, within 2 hours)
export const deleteDisposalRequest = async (req: AuthRequest, res: Response) => {
    try {
        if (req.user?.role !== "USER") {
            return res.status(403).json({ success: false, error: "Only users can delete their requests" });
        }

        const { id } = req.params;

        // Get the request
        const { data: request, error: reqError } = await supabase
            .from('disposal_requests')
            .select('*')
            .eq('id', id)
            .single();

        if (reqError || !request) {
            return res.status(404).json({ success: false, error: "Request not found" });
        }

        // Verify ownership
        if (request.user_id !== req.user._id) {
            return res.status(403).json({ success: false, error: "Not authorized to delete this request" });
        }

        // Check if within 2 hours
        const createdTime = new Date(request.created_at).getTime();
        const currentTime = new Date().getTime();
        const hoursDiff = (currentTime - createdTime) / (1000 * 60 * 60);

        if (hoursDiff > 2) {
            return res.status(400).json({ 
                success: false, 
                error: "You can only delete requests within 2 hours of creation" 
            });
        }

        // Don't allow deletion if already collected
        if (request.status === 'COLLECTED') {
            return res.status(400).json({ 
                success: false, 
                error: "Cannot delete completed requests" 
            });
        }

        // Update the pool if request was part of one
        if (request.pool_id) {
            const { data: pool } = await supabase
                .from('pickup_pools')
                .select('*')
                .eq('id', request.pool_id)
                .single();

            if (pool) {
                // Remove this request from the pool's request_ids array
                const updatedRequestIds = (pool.request_ids || []).filter((rid: string) => rid !== id);
                const newCount = updatedRequestIds.length;

                await supabase
                    .from('pickup_pools')
                    .update({
                        request_ids: updatedRequestIds,
                        current_count: newCount,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', request.pool_id);

                // Update grouping progress for remaining requests in the pool
                if (updatedRequestIds.length > 0) {
                    await supabase
                        .from('disposal_requests')
                        .update({
                            grouping_current: newCount,
                            updated_at: new Date().toISOString()
                        })
                        .in('id', updatedRequestIds);
                }

                // If pool is now empty, delete it
                if (newCount === 0) {
                    await supabase
                        .from('pickup_pools')
                        .delete()
                        .eq('id', request.pool_id);
                }
            }
        }

        // Delete the request
        const { error: deleteError } = await supabase
            .from('disposal_requests')
            .delete()
            .eq('id', id);

        if (deleteError) throw deleteError;

        res.json({ success: true, message: "Request deleted successfully" });
    } catch (error: any) {
        console.error("Delete disposal request error:", error);
        res.status(500).json({ success: false, error: "Failed to delete request" });
    }
};
