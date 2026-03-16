// TypeScript interfaces for Supabase tables

export interface IUser {
    id: string;
    name: string;
    email: string;
    password: string;
    role: "USER" | "ECENTRE" | "ADMIN";
    points: number;
    phone_number?: string;
    location_address?: string;
    location_pincode?: string;
    location_lat?: number;
    location_lng?: number;
    last_known_lat?: number;
    last_known_lng?: number;
    last_known_location_updated_at?: string;
    created_at: string;
    updated_at: string;
}

export interface IECentre {
    id: string;
    name: string;
    email: string;
    password: string;
    phone_number: string;
    location_address: string;
    location_lat: number;
    location_lng: number;
    service_areas: string[];
    verified: boolean;
    license_number: string;
    capacity: number;
    completed_pickups: number;
    rating: number;
    operational_status: "ACTIVE" | "INACTIVE" | "MAINTENANCE";
    service_radius: number;
    created_at: string;
    updated_at: string;
}

export interface IDisposalRequest {
    id: string;
    user_id: string;
    ecentre_id?: string;
    pool_id?: string;
    items: { type: string; quantity: number; description?: string }[];
    location_address: string;
    location_pincode: string;
    location_lat?: number;
    location_lng?: number;
    image_url?: string;
    description?: string;
    status: "PENDING" | "GROUPING" | "ACCEPTED" | "SCHEDULED" | "COLLECTED";
    estimated_incentive_min: number;
    estimated_incentive_max: number;
    actual_incentive?: number;
    scheduled_pickup_id?: string;
    grouping_current: number;
    grouping_target: number;
    created_at: string;
    updated_at: string;
}

export interface IPickupPool {
    id: string;
    ecentre_id: string;
    area: string;
    request_ids: string[];
    max_capacity: number;
    current_count: number;
    status: "OPEN" | "ACCEPTED" | "SCHEDULED" | "COLLECTED";
    items_summary: { type: string; quantity: number }[];
    created_at: string;
    updated_at: string;
}

export interface IPickup {
    id: string;
    ecentre_id: string;
    request_ids: string[];
    area_pincode: string;
    area_lat: number;
    area_lng: number;
    area_radius: number;
    status: "PENDING" | "SCHEDULED" | "IN_PROGRESS" | "COMPLETED";
    scheduled_date?: string;
    scheduled_time_start?: string;
    scheduled_time_end?: string;
    vehicle_type: "TWO_WHEELER" | "SMALL_VEHICLE";
    items_summary: { type: string; quantity: number }[];
    household_count: number;
    completed_at?: string;
    created_at: string;
}
