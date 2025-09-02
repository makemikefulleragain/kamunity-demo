import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

export function verifyAdminAuth(request: NextRequest): boolean {
  // Check for admin session cookie
  const sessionCookie = request.cookies.get('admin-session');
  if (!sessionCookie) {
    return false;
  }

  // Verify the session is valid (simple check for demo)
  return sessionCookie.value.startsWith('admin-session-');
}

export function createAdminSession(password: string): string | null {
  if (validateAdminPassword(password)) {
    return `admin-session-${Date.now()}`;
  }
  return null;
}

export function validateAdminPassword(password: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    console.error('ADMIN_PASSWORD environment variable not set');
    return false;
  }
  
  return password === adminPassword;
}

export async function checkAdminSession(): Promise<boolean> {
  try {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('admin-session');
    return !!sessionCookie && sessionCookie.value.startsWith('admin-session-');
  } catch {
    return false;
  }
}
