import { NextRequest, NextResponse } from 'next/server';
import { validateAdminPassword, createAdminSession } from '@/lib/admin/auth';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!validateAdminPassword(password)) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    const sessionToken = createAdminSession(password);
    
    const response = NextResponse.json({ 
      success: true, 
      message: 'Admin authenticated successfully' 
    });

    // Set secure HTTP-only cookie
    if (sessionToken) {
      response.cookies.set('admin-session', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 8 // 8 hours
      });
    }

    return response;

  } catch (error) {
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
