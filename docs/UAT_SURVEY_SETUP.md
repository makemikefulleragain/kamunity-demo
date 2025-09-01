# UAT Survey System Setup Guide

## Overview
The UAT Survey system provides recurring feedback collection with 45-second intervals, dual email delivery, and comprehensive analytics integration.

## Features Implemented
- ✅ 45-second recurring timer (configurable)
- ✅ Persistent state across page navigation and sessions
- ✅ Dual email system (admin + user)
- ✅ Email service with fallback mechanisms
- ✅ Analytics integration with demo system
- ✅ Professional 3-step survey flow
- ✅ Error handling and recovery

## Email Service Configuration

### Option 1: EmailJS (Recommended for Demo)
Add to `.env.local`:
```bash
# EmailJS Configuration
EMAILJS_SERVICE_ID=your_service_id_here
EMAILJS_TEMPLATE_ID=your_template_id_here  
EMAILJS_USER_ID=your_user_id_here
```

**Setup Steps:**
1. Create account at [EmailJS.com](https://www.emailjs.com/)
2. Create email service (Gmail, Outlook, etc.)
3. Create email template with variables: `to_email`, `subject`, `html_content`, `from_name`, `from_email`
4. Copy service ID, template ID, and user ID to environment variables

### Option 2: Console Simulation (Fallback)
If no email service is configured, the system automatically falls back to console logging for demo purposes.

## Survey Behavior

### Timer States
- `never_shown`: Initial state, triggers after 45 seconds
- `visible`: Survey is currently displayed
- `completed`: User completed survey, schedules next appearance
- `dismissed`: User dismissed survey, schedules next appearance  
- `waiting_for_next`: Waiting for next 45-second interval

### Persistence
- Survey state persists in `localStorage`
- Timer continues across page navigation
- State survives browser refresh

### Analytics Integration
- Tracks survey completion/dismissal
- Integrates with existing demo analytics system
- Provides engagement level scoring

## Testing

### Manual Testing
1. Load any page → Wait 45 seconds → Survey appears
2. Dismiss survey → Wait 45 seconds → Survey reappears
3. Complete survey → Wait 45 seconds → Survey reappears
4. Navigate between pages → Timer persists

### Debug Mode
In development, a debug indicator shows:
- Current survey state
- Next trigger time
- Located in top-right corner

### Email Testing
1. Complete survey with email address
2. Check console for email delivery logs
3. Verify admin notification content
4. Verify user thank you content

## Configuration Options

### FloatingSurvey Props
```typescript
interface FloatingSurveyProps {
  onClose?: () => void;
  triggerDelay?: number; // Initial delay (default: 45000ms)
  recurringInterval?: number; // Recurring interval (default: 45000ms)
}
```

### Customization
- Adjust timing in `layout.tsx`: `<FloatingSurvey triggerDelay={30000} recurringInterval={60000} />`
- Modify survey questions in `FloatingSurvey.tsx`
- Update email templates in `survey/route.ts`

## Production Deployment

### Email Service Requirements
- Configure EmailJS or alternative email service
- Test email delivery before demo
- Monitor email delivery rates

### Performance Considerations
- Timer cleanup prevents memory leaks
- localStorage usage is minimal
- No impact on page performance

### Demo Readiness Checklist
- [ ] Email service configured and tested
- [ ] Survey timing tested across multiple sessions
- [ ] Email delivery confirmed for both admin and user
- [ ] Analytics tracking verified
- [ ] Error scenarios tested
- [ ] Mobile responsiveness confirmed

## Troubleshooting

### Survey Not Appearing
1. Check browser console for errors
2. Verify localStorage is enabled
3. Check debug indicator in development mode

### Email Not Sending
1. Verify environment variables are set
2. Check console logs for email delivery status
3. Test EmailJS configuration separately

### Timer Issues
1. Clear localStorage: `localStorage.clear()`
2. Refresh page to reset state
3. Check for JavaScript errors in console

## Success Metrics
- Survey appearance rate: 95%+
- Email delivery rate: 90%+
- User completion rate: Target varies
- System reliability: 99%+ uptime during demo
