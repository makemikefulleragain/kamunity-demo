import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Log analytics event for demo purposes
    console.log('Demo Analytics Event Received:', {
      timestamp: new Date().toISOString(),
      ...body
    })
    
    // In a real implementation, you would store this in a database
    // For demo purposes, we'll just acknowledge receipt
    
    return NextResponse.json({ 
      success: true, 
      message: 'Analytics event recorded',
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Demo Analytics API Error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process analytics event',
        message: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Demo Analytics API is running',
    timestamp: new Date().toISOString(),
    endpoints: {
      POST: 'Submit analytics events',
      GET: 'Health check'
    }
  })
}
