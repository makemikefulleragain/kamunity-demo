import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db-operations';

export async function GET() {
  try {
    const conversations = await prisma.conversation.findMany({
      orderBy: {
        updatedAt: 'desc',
      },
      include: {
        messages: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
        _count: {
          select: { messages: true },
        },
      },
    });

    const conversationsWithDetails = conversations.map(conv => ({
      id: conv.id,
      topic: conv.topic,
      updatedAt: conv.updatedAt,
      messageCount: conv._count.messages,
      lastMessage: conv.messages[0]?.content || 'No messages yet...',
    }));

    return NextResponse.json(conversationsWithDetails);

  } catch (error) {
    console.error('Failed to fetch conversations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversations. Please try again.' },
      { status: 500 }
    );
  }
}
