import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/lib/supabase/types'

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

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

    let query = supabase.from('manual_summaries').select('*').order('created_at', { ascending: false });
    
    if (timeframe) query = query.eq('timeframe', timeframe);
    if (perspective) query = query.eq('perspective', perspective);
    
    const { data: summaries, error } = await query;
    
    if (error) {
      return NextResponse.json({ error: 'Failed to fetch summaries' }, { status: 500 });
    }

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

    const { data: newSummary, error } = await supabase
      .from('manual_summaries')
      .insert({
        page,
        summary_text: summaryText,
        summary_audio_url: summaryAudioUrl || '',
        perspective,
        timeframe,
      })
      .select()
      .single();
    
    if (error) {
      return NextResponse.json({ error: 'Failed to create summary' }, { status: 500 });
    }

    return NextResponse.json(newSummary, { status: 201 });
  } catch (error) {
    console.error('Error creating manual summary:', error);
    return NextResponse.json({ error: 'Failed to create summary' }, { status: 500 });
  }
}
