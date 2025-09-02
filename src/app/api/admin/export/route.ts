import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/admin/auth';
import { AdminDatabase } from '@/lib/admin/database';
import { generateCombinedCSV, generateRoomsCSV, generateSurveysCSV, generateUserTrackingCSV } from '@/lib/admin/csv-export';

export async function GET(request: NextRequest) {
  if (!verifyAdminAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const exportType = searchParams.get('type') || 'all';

    const data = await AdminDatabase.exportAllData();

    let csvContent: string;
    let filename: string;

    switch (exportType) {
      case 'rooms':
        csvContent = generateRoomsCSV(data.rooms);
        filename = `kamunity-rooms-${new Date().toISOString().split('T')[0]}.csv`;
        break;
      case 'surveys':
        csvContent = generateSurveysCSV(data.surveys);
        filename = `kamunity-surveys-${new Date().toISOString().split('T')[0]}.csv`;
        break;
      case 'tracking':
        csvContent = generateUserTrackingCSV(data.tracking);
        filename = `kamunity-tracking-${new Date().toISOString().split('T')[0]}.csv`;
        break;
      default:
        csvContent = generateCombinedCSV(data);
        filename = `kamunity-export-${new Date().toISOString().split('T')[0]}.csv`;
    }

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    );
  }
}
