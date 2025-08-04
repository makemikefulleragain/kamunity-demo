import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db-operations';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get('page');
  const timeframe = searchParams.get('timeframe');
  const perspective = searchParams.get('perspective');

  if (!page) {
    return NextResponse.json({ error: 'Missing required query parameter: page' }, { status: 400 });
  }

  try {
    const whereClause: any = { page };
    if (timeframe) whereClause.timeframe = timeframe;
    if (perspective) whereClause.perspective = perspective;

    const summaries = await prisma.manualSummary.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(summaries);
  } catch (error) {
    console.error('Error fetching manual summaries:', error);
    return NextResponse.json({ error: 'Failed to fetch summaries' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { page, summaryText, summaryAudioUrl, perspective, timeframe } = body;

    if (!page || !summaryText || !perspective || !timeframe) {
      return NextResponse.json({ error: 'Missing required fields: page, summaryText, perspective, timeframe' }, { status: 400 });
    }

    const newSummary = await prisma.manualSummary.create({
      data: {
        page,
        summaryText,
        summaryAudioUrl: summaryAudioUrl || '',
        perspective,
        timeframe,
      },
    });

    return NextResponse.json(newSummary, { status: 201 });
  } catch (error) {
    console.error('Error creating manual summary:', error);
    return NextResponse.json({ error: 'Failed to create summary' }, { status: 500 });
  }
}
