-- Safra v1.5 Schema Migration
-- Run this in your Supabase SQL Editor

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

-- Enable RLS on listings
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

-- Everyone can read active listings
CREATE POLICY "Listings are publicly readable"
  ON listings FOR SELECT
  USING (is_active = true);

-- Hosts can read their own listings (including inactive)
CREATE POLICY "Hosts can read own listings"
  ON listings FOR SELECT
  USING (owner_id = auth.uid());

-- Admins can read all listings
CREATE POLICY "Admins can read all listings"
  ON listings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Hosts can insert their own listings
CREATE POLICY "Hosts can insert own listings"
  ON listings FOR INSERT
  WITH CHECK (owner_id = auth.uid());

-- Hosts can update their own listings
CREATE POLICY "Hosts can update own listings"
  ON listings FOR UPDATE
  USING (owner_id = auth.uid());

-- Hosts can delete their own listings
CREATE POLICY "Hosts can delete own listings"
  ON listings FOR DELETE
  USING (owner_id = auth.uid());

-- Admins can update any listing
CREATE POLICY "Admins can update any listing"
  ON listings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Admins can delete any listing
CREATE POLICY "Admins can delete any listing"
  ON listings FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
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

-- Enable RLS on bookings
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Travelers can read their own bookings
CREATE POLICY "Travelers can read own bookings"
  ON bookings FOR SELECT
  USING (guest_id = auth.uid());

-- Hosts can read bookings for their own listings
CREATE POLICY "Hosts can read bookings for own listings"
  ON bookings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM listings
      WHERE listings.id = bookings.listing_id
      AND listings.owner_id = auth.uid()
    )
  );

-- Admins can read all bookings
CREATE POLICY "Admins can read all bookings"
  ON bookings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Travelers can create bookings for themselves
CREATE POLICY "Travelers can create bookings"
  ON bookings FOR INSERT
  WITH CHECK (guest_id = auth.uid());

-- Travelers can cancel their own bookings
CREATE POLICY "Travelers can update own bookings"
  ON bookings FOR UPDATE
  USING (guest_id = auth.uid());

-- Hosts can update bookings for their own listings (confirm/cancel)
CREATE POLICY "Hosts can update bookings for own listings"
  ON bookings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM listings
      WHERE listings.id = bookings.listing_id
      AND listings.owner_id = auth.uid()
    )
  );

-- Admins can update any booking
CREATE POLICY "Admins can update any booking"
  ON bookings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Admins can delete any booking
CREATE POLICY "Admins can delete any booking"
  ON bookings FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- ============================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_listings_owner_id ON listings(owner_id);
CREATE INDEX IF NOT EXISTS idx_listings_type ON listings(type);
CREATE INDEX IF NOT EXISTS idx_listings_is_active ON listings(is_active);
CREATE INDEX IF NOT EXISTS idx_bookings_listing_id ON bookings(listing_id);
CREATE INDEX IF NOT EXISTS idx_bookings_guest_id ON bookings(guest_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
