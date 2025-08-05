import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/lib/supabase/types'

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface RoomRequest {
  name: string;
  purpose: string;
  description: string;
  category: string;
  estimatedMembers: string;
  timeCommitment: string;
  skillsNeeded: string[];
  expectedOutcomes: string[];
  tools: string[];
  tags: string[];
  requestedBy: string;
  requestType: 'generated' | 'custom';
}

// POST /api/rooms/request - Submit a room request
export async function POST(request: NextRequest) {
  try {
    const body: RoomRequest = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'purpose', 'description', 'requestedBy'];
    for (const field of requiredFields) {
      if (!body[field as keyof RoomRequest]) {
        return NextResponse.json(
          { 
            success: false, 
            error: `Missing required field: ${field}` 
          },
          { status: 400 }
        );
      }
    }

    // For now, we'll store room requests in a simple format
    // In the future, this could be a separate RoomRequest model
    const roomRequest = {
      name: body.name,
      purpose: body.purpose,
      description: body.description,
      category: body.category || 'Community Building',
      estimatedMembers: body.estimatedMembers || '5-15',
      timeCommitment: body.timeCommitment || '2-4 hours/week',
      skillsNeeded: body.skillsNeeded || [],
      expectedOutcomes: body.expectedOutcomes || [],
      tools: body.tools || [],
      tags: body.tags || [],
      requestedBy: body.requestedBy,
      requestType: body.requestType || 'custom',
      status: 'pending',
      requestedAt: new Date(),
    };

    // For MVP, we'll create the room immediately
    // In production, this would go through an approval process
    const { data: newRoom, error } = await supabase
      .from('focus_rooms')
      .insert({
        name: roomRequest.name,
        purpose: roomRequest.purpose,
        description: roomRequest.description,
        status: 'active',
        is_private: false,
        max_members: parseInt(roomRequest.estimatedMembers.split('-')[1]) || 15,
        // For MVP, assign to a default club - this should be dynamic in production
        club_id: 'default-club-id', // This will need to be handled properly
      })
      .select()
      .single()
    
    if (error) {
      return NextResponse.json({ error: 'Failed to create room' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Room request submitted successfully',
      data: {
        requestId: newRoom.id,
        roomId: newRoom.id,
        status: 'approved', // For MVP, auto-approve
        room: {
          id: newRoom.id,
          name: newRoom.name,
          purpose: newRoom.purpose,
          description: newRoom.description,
        }
      }
    });

  } catch (error) {
    console.error('Room request error:', error);
    
    // Handle specific Prisma errors
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'A room with this name already exists' 
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to submit room request. Please try again.' 
      },
      { status: 500 }
    );
  }
}

// GET /api/rooms/request - Get room requests (for admin/moderation)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'all';
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // For MVP, we'll just return created rooms
    // In production, this would query a RoomRequest model
    let query = supabase
      .from('focus_rooms')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)
    
    if (status !== 'all') {
      query = query.eq('status', status)
    }
    
    const { data: rooms, error } = await query
    
    if (error) {
      return NextResponse.json({ error: 'Failed to fetch rooms' }, { status: 500 })
    }

    const roomRequests = rooms?.map((room: any) => ({
      id: room.id,
      name: room.name,
      purpose: room.purpose,
      description: room.description,
      status: room.status,
      memberCount: room._count.members,
      createdAt: room.createdAt,
      tags: room.tags,
    }));

    return NextResponse.json({
      success: true,
      data: {
        requests: roomRequests,
        total: roomRequests.length,
        hasMore: roomRequests.length === limit
      }
    });

  } catch (error) {
    console.error('Failed to fetch room requests:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch room requests' 
      },
      { status: 500 }
    );
  }
}
