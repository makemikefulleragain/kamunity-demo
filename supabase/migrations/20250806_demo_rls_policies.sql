-- Demo-ready RLS policies for public access to chat functionality
-- This allows anonymous users to view and interact with chat rooms for demo purposes

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Messages readable by participants" ON public.messages;
DROP POLICY IF EXISTS "Users can insert messages in joined rooms" ON public.messages;

-- Create demo-friendly policies for messages
CREATE POLICY "Messages are publicly readable for demo" ON public.messages
    FOR SELECT USING (true);

CREATE POLICY "Anyone can insert messages for demo" ON public.messages
    FOR INSERT WITH CHECK (true);

-- Update room participants to allow public access
DROP POLICY IF EXISTS "Users can join rooms" ON public.room_participants;
DROP POLICY IF EXISTS "Users can leave rooms" ON public.room_participants;

CREATE POLICY "Anyone can view room participants for demo" ON public.room_participants
    FOR SELECT USING (true);

CREATE POLICY "Anyone can join rooms for demo" ON public.room_participants
    FOR INSERT WITH CHECK (true);

-- Enable realtime for messages table
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE public.room_participants;
