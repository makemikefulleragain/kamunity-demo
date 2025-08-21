-- Kamunity Demo Database Cleanup Script
-- This script removes all test accounts and resets the database for fresh demo night signups
-- Execute this in Supabase SQL Editor

-- Step 1: Delete all user sessions (to avoid foreign key constraints)
DELETE FROM user_sessions;

-- Step 2: Delete all analytics events
DELETE FROM analytics_events;

-- Step 3: Delete all messages (to avoid foreign key constraints with users)
DELETE FROM messages;

-- Step 4: Delete all room participants
DELETE FROM room_participants;

-- Step 5: Delete all news comments
DELETE FROM news_comments;

-- Step 6: Delete all user profiles from custom users table
DELETE FROM users;

-- Step 7: Delete all auth users (this is the main cleanup)
-- Note: This deletes from auth.users which is the Supabase Auth table
DELETE FROM auth.users;

-- Step 8: Reset any auto-increment sequences (if needed)
-- ALTER SEQUENCE users_id_seq RESTART WITH 1;

-- Verification queries (run these after cleanup to confirm)
-- SELECT COUNT(*) as total_auth_users FROM auth.users;
-- SELECT COUNT(*) as total_profile_users FROM users;
-- SELECT COUNT(*) as total_messages FROM messages;
-- SELECT COUNT(*) as total_analytics FROM analytics_events;
-- SELECT COUNT(*) as total_sessions FROM user_sessions;

-- Success message
SELECT 'Database cleanup completed! All test accounts removed.' as status;
