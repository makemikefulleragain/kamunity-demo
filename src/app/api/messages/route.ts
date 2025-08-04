import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { content, conversationId, userId, authorName } = body

    // Validate required fields
    if (!content || !conversationId || !userId) {
      return NextResponse.json({ 
        error: 'Missing required fields: content, conversationId, userId' 
      }, { status: 400 })
    }

    // Create the message
    const message = await prisma.message.create({
      data: {
        content,
        conversationId,
        userId,
        authorName: authorName || 'Anonymous'
      }
    })

    // Update conversation's last activity
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() }
    })

    return NextResponse.json({
      success: true,
      message: {
        id: message.id,
        content: message.content,
        authorName: message.authorName,
        createdAt: message.createdAt,
        conversationId: message.conversationId
      }
    })

  } catch (error) {
    console.error('Message creation error:', error)
    return NextResponse.json({ 
      error: 'Failed to send message. Please try again.' 
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const conversationId = searchParams.get('conversationId')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    if (!conversationId) {
      return NextResponse.json({ 
        error: 'Missing conversationId parameter' 
      }, { status: 400 })
    }

    // Get messages for the conversation
    const messages = await prisma.message.findMany({
      where: {
        conversationId
      },
      orderBy: {
        createdAt: 'asc'
      },
      skip: offset,
      take: limit
    })

    return NextResponse.json({
      messages,
      total: messages.length,
      hasMore: messages.length === limit
    })

  } catch (error) {
    console.error('Get messages error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch messages. Please try again.' 
    }, { status: 500 })
  }
}
