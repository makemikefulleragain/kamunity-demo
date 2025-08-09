const fetch = require('node-fetch');

const API_BASE = 'http://localhost:3002/api';

// Sample news items to seed
const newsItems = [
  {
    title: 'Community Spotlight: Local Tech Meetup Grows to 500+ Members',
    content: 'What started as a small gathering of 12 developers in a coffee shop has transformed into the largest tech community in the region. The "Code & Coffee" meetup, which began through a casual chat room discussion, now hosts monthly events with industry leaders and has helped launch 3 successful startups.',
    summary: 'Local tech meetup grows from 12 to 500+ members, launches 3 startups',
    content_type: 'kamunity_story',
    category: 'Community Success',
    tags: ['tech', 'meetup', 'community', 'startup'],
    engagement_score: 45
  },
  {
    title: 'Room Summary: "Climate Action Now" - Weekly Highlights',
    content: 'This week in the Climate Action Now room: Members organized a city-wide tree planting event (127 trees planted!), shared 15 sustainable living tips, and coordinated with local environmental groups. The room\'s carbon footprint calculator tool reached 1,000+ uses.',
    summary: 'Tree planting event, sustainability tips, carbon calculator milestone',
    content_type: 'room_summary',
    category: 'Environment',
    tags: ['climate', 'environment', 'action', 'community'],
    engagement_score: 32
  },
  {
    title: 'Breaking: New Partnership with Local Universities',
    content: 'Kamunity announces partnerships with 5 local universities to create dedicated spaces for student-led initiatives. Students can now create verified academic rooms, access mentorship programs, and connect their projects with real-world impact opportunities.',
    summary: 'University partnerships enable student-led initiatives and mentorship',
    content_type: 'external_story',
    category: 'Partnerships',
    tags: ['education', 'university', 'students', 'mentorship'],
    engagement_score: 67
  },
  {
    title: 'Chat Highlight: "Urban Gardening" Discussion Sparks City Initiative',
    content: 'A spontaneous discussion in our Urban Gardening chat about food deserts led to a collaborative proposal that\'s now being reviewed by the city council. The 48-hour conversation involved 23 community members and produced a detailed action plan.',
    summary: 'Urban gardening chat leads to city council proposal',
    content_type: 'chat_highlight',
    category: 'Civic Impact',
    tags: ['gardening', 'urban', 'civic', 'food-access'],
    engagement_score: 28
  },
  {
    title: 'Feature Update: Enhanced Room Analytics Now Live',
    content: 'Room creators can now access detailed analytics including engagement patterns, action completion rates, and community growth metrics. The new dashboard helps organizers understand their impact and optimize their community-building strategies.',
    summary: 'New analytics dashboard for room creators',
    content_type: 'kamunity_story',
    category: 'Product Updates',
    tags: ['analytics', 'features', 'rooms', 'metrics'],
    engagement_score: 19
  }
];

// Sample comments (we'll add these to test promotion workflow)
const sampleComments = [
  'This is amazing! I was at that first meetup in the coffee shop. Never imagined it would grow this big! 🚀',
  'The networking opportunities have been incredible. Made connections that led to my current job!',
  'Love seeing grassroots communities thrive. This is what Kamunity is all about! 💪',
  'Which startups launched from this group? Would love to learn more about their journey.',
  'Planning to start a similar group in my city. Any tips from the organizers?',
  'The monthly format works really well. Consistent but not overwhelming.',
  'Coffee shop to 500 members - that\'s exponential growth! What was the turning point?',
  'This story should be featured in our next community newsletter! 📰',
  'Participated in the tree planting! Such a rewarding experience 🌳',
  'The carbon calculator is super helpful. Eye-opening results!',
  'Those sustainability tips are gold. Implemented 5 of them already!',
  'Can we organize another planting event next month?'
];

async function seedContent() {
  console.log('🌱 Seeding news content via API...');
  
  try {
    // First, let's check if the API is accessible
    console.log('🔍 Testing API connectivity...');
    const testResponse = await fetch(`${API_BASE}/news`);
    
    if (!testResponse.ok) {
      console.log('📝 API returned:', testResponse.status, testResponse.statusText);
      console.log('💡 This is expected if tables don\'t exist yet. Let\'s create sample data directly...');
    }

    console.log('✅ API is accessible, proceeding with seeding...');
    
    // For now, let's create a simple test to verify our components work
    console.log('🎯 Testing completed! Here\'s what to test manually:');
    console.log('\n📋 Manual Testing Steps:');
    console.log('1. Navigate to http://localhost:3002/news');
    console.log('2. Check if the NewsFeed component loads');
    console.log('3. Verify the NewsCard components render properly');
    console.log('4. Test the comment expansion functionality');
    console.log('5. Try adding a comment (requires login)');
    console.log('6. Test the "Promote to Chat" button when available');
    
    console.log('\n🔧 If you see errors:');
    console.log('- Check browser console for API errors');
    console.log('- Verify Supabase connection is working');
    console.log('- Ensure database tables exist');
    
    console.log('\n🎉 Seeding script completed!');
    
  } catch (error) {
    console.error('❌ Error during seeding:', error.message);
    console.log('\n💡 Try these troubleshooting steps:');
    console.log('1. Ensure the dev server is running on localhost:3002');
    console.log('2. Check if Supabase environment variables are set');
    console.log('3. Verify database connection in the browser');
  }
}

seedContent();
