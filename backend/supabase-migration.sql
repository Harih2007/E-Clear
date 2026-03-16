-- E-Clear Supabase Schema Migration
-- Run this in the Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'USER' CHECK (role IN ('USER', 'ECENTRE', 'ADMIN')),
    points INTEGER DEFAULT 0,
    phone_number TEXT,
    location_address TEXT DEFAULT '',
    location_pincode TEXT DEFAULT '',
    location_lat DOUBLE PRECISION,
    location_lng DOUBLE PRECISION,
    last_known_lat DOUBLE PRECISION,
    last_known_lng DOUBLE PRECISION,
    last_known_location_updated_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- E-Centres table
CREATE TABLE IF NOT EXISTS ecentres (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    location_address TEXT NOT NULL,
    location_lat DOUBLE PRECISION NOT NULL,
    location_lng DOUBLE PRECISION NOT NULL,
    service_areas TEXT[] DEFAULT '{}',
    verified BOOLEAN DEFAULT FALSE,
    license_number TEXT NOT NULL,
    capacity INTEGER DEFAULT 100,
    completed_pickups INTEGER DEFAULT 0,
    rating DOUBLE PRECISION DEFAULT 5.0,
    operational_status TEXT DEFAULT 'ACTIVE' CHECK (operational_status IN ('ACTIVE', 'INACTIVE', 'MAINTENANCE')),
    service_radius DOUBLE PRECISION DEFAULT 10,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pickup Pools table
CREATE TABLE IF NOT EXISTS pickup_pools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ecentre_id UUID REFERENCES ecentres(id),
    area TEXT NOT NULL,
    request_ids UUID[] DEFAULT '{}',
    max_capacity INTEGER DEFAULT 5,
    current_count INTEGER DEFAULT 0,
    status TEXT DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'ACCEPTED', 'SCHEDULED', 'COLLECTED')),
    items_summary JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disposal Requests table
CREATE TABLE IF NOT EXISTS disposal_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    ecentre_id UUID REFERENCES ecentres(id),
    pool_id UUID REFERENCES pickup_pools(id),
    items JSONB NOT NULL DEFAULT '[]',
    location_address TEXT NOT NULL,
    location_pincode TEXT NOT NULL,
    location_lat DOUBLE PRECISION,
    location_lng DOUBLE PRECISION,
    image_url TEXT,
    description TEXT,
    status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'GROUPING', 'ACCEPTED', 'SCHEDULED', 'COLLECTED')),
    estimated_incentive_min DOUBLE PRECISION NOT NULL DEFAULT 0,
    estimated_incentive_max DOUBLE PRECISION NOT NULL DEFAULT 0,
    actual_incentive DOUBLE PRECISION,
    scheduled_pickup_id UUID,
    grouping_current INTEGER DEFAULT 1,
    grouping_target INTEGER DEFAULT 5,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pickups table
CREATE TABLE IF NOT EXISTS pickups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ecentre_id UUID REFERENCES ecentres(id),
    request_ids UUID[] DEFAULT '{}',
    area_pincode TEXT NOT NULL,
    area_lat DOUBLE PRECISION NOT NULL,
    area_lng DOUBLE PRECISION NOT NULL,
    area_radius DOUBLE PRECISION DEFAULT 2,
    status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED')),
    scheduled_date TIMESTAMPTZ,
    scheduled_time_start TEXT,
    scheduled_time_end TEXT,
    vehicle_type TEXT DEFAULT 'TWO_WHEELER' CHECK (vehicle_type IN ('TWO_WHEELER', 'SMALL_VEHICLE')),
    items_summary JSONB DEFAULT '[]',
    household_count INTEGER DEFAULT 0,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add scheduled_pickup_id FK after pickups table exists
ALTER TABLE disposal_requests 
    ADD CONSTRAINT fk_scheduled_pickup 
    FOREIGN KEY (scheduled_pickup_id) REFERENCES pickups(id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_ecentres_email ON ecentres(email);
CREATE INDEX IF NOT EXISTS idx_ecentres_verified ON ecentres(verified);
CREATE INDEX IF NOT EXISTS idx_ecentres_status ON ecentres(operational_status);
CREATE INDEX IF NOT EXISTS idx_disposal_user ON disposal_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_disposal_ecentre ON disposal_requests(ecentre_id);
CREATE INDEX IF NOT EXISTS idx_disposal_pool ON disposal_requests(pool_id);
CREATE INDEX IF NOT EXISTS idx_disposal_status ON disposal_requests(status);
CREATE INDEX IF NOT EXISTS idx_disposal_pincode ON disposal_requests(location_pincode);
CREATE INDEX IF NOT EXISTS idx_pickups_ecentre ON pickups(ecentre_id);
CREATE INDEX IF NOT EXISTS idx_pickups_status ON pickups(status);
CREATE INDEX IF NOT EXISTS idx_pools_ecentre ON pickup_pools(ecentre_id);
CREATE INDEX IF NOT EXISTS idx_pools_area ON pickup_pools(area);
CREATE INDEX IF NOT EXISTS idx_pools_status ON pickup_pools(status);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE ecentres ENABLE ROW LEVEL SECURITY;
ALTER TABLE disposal_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE pickups ENABLE ROW LEVEL SECURITY;
ALTER TABLE pickup_pools ENABLE ROW LEVEL SECURITY;

-- Service role can access everything (for backend)
CREATE POLICY "Service role access" ON users FOR ALL USING (true);
CREATE POLICY "Service role access" ON ecentres FOR ALL USING (true);
CREATE POLICY "Service role access" ON disposal_requests FOR ALL USING (true);
CREATE POLICY "Service role access" ON pickups FOR ALL USING (true);
CREATE POLICY "Service role access" ON pickup_pools FOR ALL USING (true);
