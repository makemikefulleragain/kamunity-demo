import { NextResponse, type NextRequest } from 'next/server'

// Simplified middleware for Edge Runtime compatibility
// Removed Supabase session handling to avoid Node.js API issues
export async function middleware(_request: NextRequest) {
  // For now, just pass through all requests
  // TODO: Re-implement session handling with Edge Runtime compatible approach
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
