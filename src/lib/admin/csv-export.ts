import { DemoRoomData, DemoSurveyData, DemoUserTrackingData } from './database';

export interface CSVExportData {
  rooms: DemoRoomData[];
  surveys: DemoSurveyData[];
  tracking: DemoUserTrackingData[];
}

export function generateRoomsCSV(rooms: DemoRoomData[]): string {
  const headers = [
    'ID', 'Title', 'Description', 'Category', 'Engagement', 'Tags', 
    'Created By', 'Created At', 'Has Specification'
  ];

  const rows = rooms.map(room => [
    room.id,
    `"${room.title}"`,
    `"${room.description || ''}"`,
    room.category || '',
    room.engagement || '',
    `"${room.tags.join(', ')}"`,
    room.createdBy,
    room.createdAt.toISOString(),
    room.specification ? 'Yes' : 'No'
  ]);

  return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
}

export function generateSurveysCSV(surveys: DemoSurveyData[]): string {
  const headers = [
    'ID', 'User Email', 'Session ID', 'Experience', 'Most Interesting', 
    'Suggestions', 'Would Use Again', 'Additional Features', 'Room Ideas', 
    'Engagement Level', 'Created At'
  ];

  const rows = surveys.map(survey => {
    const responses = survey.responses || {};
    const analytics = survey.analytics || {};
    
    return [
      survey.id,
      survey.userEmail || '',
      survey.sessionId,
      `"${responses.experience || ''}"`,
      `"${responses.mostInteresting || ''}"`,
      `"${responses.suggestions || ''}"`,
      responses.wouldUseAgain || '',
      `"${responses.additionalFeatures || ''}"`,
      `"${responses.roomIdeas || ''}"`,
      analytics.engagementLevel || '',
      survey.createdAt.toISOString()
    ];
  });

  return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
}

export function generateUserTrackingCSV(tracking: DemoUserTrackingData[]): string {
  const headers = [
    'ID', 'Session ID', 'User Email', 'Total Actions', 'Page Views', 
    'Button Clicks', 'Form Submissions', 'Time Spent', 'Created At'
  ];

  const rows = tracking.map(track => {
    const actions = track.actions || [];
    const pageViews = actions.filter(a => a.type === 'page_view').length;
    const buttonClicks = actions.filter(a => a.type === 'button_click').length;
    const formSubmissions = actions.filter(a => a.type === 'form_submit').length;
    
    // Calculate time spent from first to last action
    const timestamps = actions.map(a => new Date(a.timestamp)).sort();
    const timeSpent = timestamps.length > 1 
      ? Math.round((timestamps[timestamps.length - 1].getTime() - timestamps[0].getTime()) / 1000 / 60)
      : 0;

    return [
      track.id,
      track.sessionId,
      track.userEmail || '',
      actions.length,
      pageViews,
      buttonClicks,
      formSubmissions,
      `${timeSpent} min`,
      track.createdAt.toISOString()
    ];
  });

  return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
}

export function generateCombinedCSV(data: CSVExportData): string {
  const roomsCSV = generateRoomsCSV(data.rooms);
  const surveysCSV = generateSurveysCSV(data.surveys);
  const trackingCSV = generateUserTrackingCSV(data.tracking);

  return `DEMO ROOMS\n${roomsCSV}\n\nSURVEY RESPONSES\n${surveysCSV}\n\nUSER TRACKING\n${trackingCSV}`;
}

export function downloadCSV(content: string, filename: string): void {
  if (typeof window === 'undefined') return;
  
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
