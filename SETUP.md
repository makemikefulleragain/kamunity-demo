# Kamunity Demo Setup Guide

## 🚀 Quick Start

### 1. Environment Setup

1. Copy the environment template:
```bash
cp .env.local.example .env.local
```

2. Create a new Supabase project at [supabase.com](https://supabase.com)

3. Update `.env.local` with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 2. Database Setup

1. In your Supabase dashboard, go to SQL Editor
2. Copy and paste the contents of `supabase/schema.sql`
3. Run the SQL to create all tables, policies, and functions

### 3. Email Configuration (Optional for initial testing)

Add email service configuration to `.env.local`:
```env
EMAIL_SERVICE_API_KEY=your-email-service-key
EMAIL_FROM_ADDRESS=noreply@kamunity.com
EMAIL_ADMIN_ADDRESS=your-admin@example.com
```

### 4. Run the Application

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 🎯 Demo Features

### Authentication
- ✅ Email/password signup with emoji avatar selection
- ✅ User profiles with username and email subscription
- ✅ 100 concurrent user limit with queue system
- ✅ Session management and middleware protection

### News Feed (Next Phase)
- 🔄 Real-time emoji reactions
- 🔄 Algorithmic content sorting
- 🔄 Pre-populated Perth/WA content

### Chat & Rooms (Next Phase)
- 🔄 Real-time messaging
- 🔄 Focus room creation
- 🔄 Room request system

### Email System (Next Phase)
- 🔄 Room request notifications
- 🔄 Email subscriptions
- 🔄 Netlify Functions integration

## 🛠️ Development Notes

- Uses Next.js 14 with App Router
- Supabase for database, auth, and real-time features
- Tailwind CSS for styling
- TypeScript for type safety
- Row Level Security (RLS) enabled for data protection

## 🎪 Demo Configuration

The app is configured for demo mode with:
- Maximum 100 concurrent users
- 3-day data retention post-demo
- Analytics tracking for user behavior
- Graceful degradation if services fail

## 📊 Database Schema

Key tables:
- `users` - User profiles with emoji avatars
- `articles` - News content with engagement scores
- `reactions` - Emoji reactions to articles
- `rooms` - Chat and focus rooms
- `messages` - Real-time chat messages
- `analytics_events` - User behavior tracking

## 🔧 Troubleshooting

### Common Issues:

1. **Supabase Connection Error**
   - Verify your environment variables
   - Check Supabase project status
   - Ensure RLS policies are properly set

2. **Authentication Not Working**
   - Confirm email/password requirements
   - Check browser console for errors
   - Verify user table creation

3. **Queue Page Always Shows**
   - Check `NEXT_PUBLIC_DEMO_MODE` setting
   - Verify user session cleanup
   - Clear browser storage

### Development Commands:

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run type-check
```

## 🎯 Next Development Phases

1. **Phase 2**: Real-time chat and emoji reactions
2. **Phase 3**: Room system and email notifications  
3. **Phase 4**: Analytics, help system, and demo polish

Ready to continue with Phase 2 implementation!
