import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/admin/auth';
import { AdminDatabase } from '@/lib/admin/database';

export async function GET(request: NextRequest) {
  if (!verifyAdminAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const tracking = await AdminDatabase.getAllUserTracking();
    return NextResponse.json({ tracking });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch user tracking' },
      { status: 500 }
    );
  }
}
