import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
    const newRoom = await prisma.focusRoom.create({
      data: {
        name: roomRequest.name,
        purpose: roomRequest.purpose,
        description: roomRequest.description,
        tags: roomRequest.tags,
        status: 'active',
        isPrivate: false,
        maxMembers: parseInt(roomRequest.estimatedMembers.split('-')[1]) || 15,
        // For MVP, assign to a default club - this should be dynamic in production
        clubId: 'default-club-id', // This will need to be handled properly
      }
    });

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
    const whereClause = status === 'all' ? {} : { status };
    
    const rooms = await prisma.focusRoom.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
      include: {
        _count: {
          select: { members: true }
        }
      }
    });

    const roomRequests = rooms.map(room => ({
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
