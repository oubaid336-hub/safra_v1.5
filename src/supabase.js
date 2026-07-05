/*
  SUPABASE SQL SCHEMA (run this in your Supabase SQL Editor):

  -- ============================================================
  -- PROFILES TABLE (existing)
  -- ============================================================
  CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'host', 'traveler')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

  ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

  CREATE POLICY "Users can read own profile"
    ON profiles FOR SELECT USING (auth.uid() = id);

  CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE USING (auth.uid() = id);

  CREATE POLICY "Users can insert own profile"
    ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

  CREATE POLICY "Profiles are publicly readable"
    ON profiles FOR SELECT USING (true);

  -- ============================================================
  -- LISTINGS TABLE
  -- ============================================================
  CREATE TABLE IF NOT EXISTS listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('house', 'car')),
    name TEXT NOT NULL,
    description TEXT,
    location TEXT,
    price NUMERIC NOT NULL DEFAULT 0,
    image_url TEXT,
    guests_or_seats INTEGER DEFAULT 1,
    amenities_or_features TEXT[] DEFAULT '{}',
    tag TEXT DEFAULT 'New',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

  ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

  CREATE POLICY "Listings are publicly readable"
    ON listings FOR SELECT USING (is_active = true);

  CREATE POLICY "Hosts can read own listings"
    ON listings FOR SELECT USING (owner_id = auth.uid());

  CREATE POLICY "Admins can read all listings"
    ON listings FOR SELECT USING (
      EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
    );

  CREATE POLICY "Hosts can insert own listings"
    ON listings FOR INSERT WITH CHECK (owner_id = auth.uid());

  CREATE POLICY "Hosts can update own listings"
    ON listings FOR UPDATE USING (owner_id = auth.uid());

  CREATE POLICY "Hosts can delete own listings"
    ON listings FOR DELETE USING (owner_id = auth.uid());

  CREATE POLICY "Admins can update any listing"
    ON listings FOR UPDATE USING (
      EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
    );

  CREATE POLICY "Admins can delete any listing"
    ON listings FOR DELETE USING (
      EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
    );

  -- ============================================================
  -- BOOKINGS TABLE
  -- ============================================================
  CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    guest_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    total_price NUMERIC NOT NULL DEFAULT 0,
    status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'cancelled')) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

  ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

  CREATE POLICY "Travelers can read own bookings"
    ON bookings FOR SELECT USING (guest_id = auth.uid());

  CREATE POLICY "Hosts can read bookings for own listings"
    ON bookings FOR SELECT USING (
      EXISTS (SELECT 1 FROM listings WHERE listings.id = bookings.listing_id AND listings.owner_id = auth.uid())
    );

  CREATE POLICY "Admins can read all bookings"
    ON bookings FOR SELECT USING (
      EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
    );

  CREATE POLICY "Travelers can create bookings"
    ON bookings FOR INSERT WITH CHECK (guest_id = auth.uid());

  CREATE POLICY "Travelers can update own bookings"
    ON bookings FOR UPDATE USING (guest_id = auth.uid());

  CREATE POLICY "Hosts can update bookings for own listings"
    ON bookings FOR UPDATE USING (
      EXISTS (SELECT 1 FROM listings WHERE listings.id = bookings.listing_id AND listings.owner_id = auth.uid())
    );

  CREATE POLICY "Admins can update any booking"
    ON bookings FOR UPDATE USING (
      EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
    );

  CREATE POLICY "Admins can delete any booking"
    ON bookings FOR DELETE USING (
      EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
    );

  -- ============================================================
  -- INDEXES
  -- ============================================================
  CREATE INDEX IF NOT EXISTS idx_listings_owner_id ON listings(owner_id);
  CREATE INDEX IF NOT EXISTS idx_listings_type ON listings(type);
  CREATE INDEX IF NOT EXISTS idx_listings_is_active ON listings(is_active);
  CREATE INDEX IF NOT EXISTS idx_bookings_listing_id ON bookings(listing_id);
  CREATE INDEX IF NOT EXISTS idx_bookings_guest_id ON bookings(guest_id);
  CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
*/

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables are not set. Auth features will not work.');
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);
