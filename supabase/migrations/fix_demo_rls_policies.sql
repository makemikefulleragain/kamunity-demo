-- Fix RLS policies for demo deployment
-- This migration allows demo user creation and interaction

-- Drop existing restrictive policies on users table
DROP POLICY IF EXISTS "Users can only view own profile" ON users;
DROP POLICY IF EXISTS "Users can only update own profile" ON users;
DROP POLICY IF EXISTS "Only authenticated users can insert" ON users;

-- Create permissive policies for demo users table
CREATE POLICY "Allow demo user creation" ON users
  FOR INSERT WITH CHECK (true);
  
CREATE POLICY "Allow demo user updates" ON users
  FOR UPDATE USING (true);
  
CREATE POLICY "Allow demo user reads" ON users
  FOR SELECT USING (true);

-- Drop existing restrictive policies on rooms table
DROP POLICY IF EXISTS "Rooms are viewable by everyone" ON rooms;
DROP POLICY IF EXISTS "Only authenticated users can create rooms" ON rooms;

-- Create permissive policies for demo rooms table
CREATE POLICY "Allow demo room creation" ON rooms
  FOR INSERT WITH CHECK (true);
  
CREATE POLICY "Allow demo room reads" ON rooms
  FOR SELECT USING (true);
  
CREATE POLICY "Allow demo room updates" ON rooms
  FOR UPDATE USING (true);

-- Drop existing restrictive policies on messages table
DROP POLICY IF EXISTS "Messages are viewable by everyone" ON messages;
DROP POLICY IF EXISTS "Only authenticated users can create messages" ON messages;

-- Create permissive policies for demo messages table
CREATE POLICY "Allow demo message creation" ON messages
  FOR INSERT WITH CHECK (true);
  
CREATE POLICY "Allow demo message reads" ON messages
  FOR SELECT USING (true);

-- Drop existing restrictive policies on news table if they exist
DROP POLICY IF EXISTS "News items are viewable by everyone" ON news;
DROP POLICY IF EXISTS "Only authenticated users can create news" ON news;

-- Create permissive policies for demo news table
CREATE POLICY "Allow demo news creation" ON news
  FOR INSERT WITH CHECK (true);
  
CREATE POLICY "Allow demo news reads" ON news
  FOR SELECT USING (true);
  
CREATE POLICY "Allow demo news updates" ON news
  FOR UPDATE USING (true);

-- Drop existing restrictive policies on comments table if they exist
DROP POLICY IF EXISTS "Comments are viewable by everyone" ON comments;
DROP POLICY IF EXISTS "Only authenticated users can create comments" ON comments;

-- Create permissive policies for demo comments table
CREATE POLICY "Allow demo comment creation" ON comments
  FOR INSERT WITH CHECK (true);
  
CREATE POLICY "Allow demo comment reads" ON comments
  FOR SELECT USING (true);
