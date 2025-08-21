# Room Preview Page Testing Checklist

## Test URL: http://localhost:3001/rooms/[room-id]

## Available Room IDs (from Golden Threads):
- `room-env-1` - Community Garden Initiative
- `room-tech-1` - Tech Mentorship Program  
- `room-health-1` - Mental Health Support Network
- `room-env-2` - Renewable Energy Co-op
- `room-social-1` - Elder Care Connection
- `room-social-2` - Youth Sports League
- `room-edu-1` - Digital Literacy for Seniors
- `room-social-3` - Local Food Bank Network

## Core Functionality Tests

### 1. Page Load & Hero Section
- [ ] Page loads without errors
- [ ] Hero section displays room name
- [ ] Member count shows correctly
- [ ] Impact score is visible
- [ ] Category badge displays

### 2. Quick Actions (5 buttons)
- [ ] **Log Impact** - Opens modal with form
  - [ ] Title field works
  - [ ] Description field works
  - [ ] Impact type dropdown works
  - [ ] People helped input works
  - [ ] Submit button saves data
  - [ ] Cancel button closes modal
  - [ ] Success toast appears after submit
- [ ] **Schedule Meeting** - Tracks click in memoryStore
- [ ] **Share Resources** - Tracks click in memoryStore  
- [ ] **Track Progress** - Tracks click in memoryStore
- [ ] **Invite Members** - Tracks click in memoryStore

### 3. Objectives Section
- [ ] All objectives display correctly
- [ ] At least 2 objectives per room
- [ ] Objectives are relevant to room theme

### 4. Chat/Kai AI Tabs
- [ ] Tab switching works smoothly
- [ ] **Group Chat Tab**:
  - [ ] Messages display with author names
  - [ ] Timestamps show correctly
  - [ ] Message reactions visible
  - [ ] Input field present at bottom
- [ ] **Kai AI Tab**:
  - [ ] Kai messages have distinct styling
  - [ ] Suggestions display properly
  - [ ] Input field for questions works

### 5. Action Tools Section
- [ ] Tools grid displays correctly
- [ ] Each tool has icon and label
- [ ] Tool clicks are tracked

### 6. Impact Logging Modal
- [ ] Modal opens on "Log Impact" click
- [ ] Form validation works:
  - [ ] Empty title shows error
  - [ ] Empty description shows error
  - [ ] Negative people helped shows error
- [ ] Successful submission:
  - [ ] Modal closes
  - [ ] Success toast appears
  - [ ] Data saved to memoryStore

### 7. Navigation & Routing
- [ ] Back button/navigation works
- [ ] Links to other rooms work
- [ ] Golden thread navigation (if implemented)

## Mobile Responsiveness Tests (320px - 768px)

### Phone (320px - 480px)
- [ ] Hero section stacks vertically
- [ ] Quick actions display as column
- [ ] Chat messages readable
- [ ] Modal fits screen
- [ ] Touch targets are 44px minimum

### Tablet (481px - 768px)  
- [ ] 2-column grid for quick actions
- [ ] Proper padding/margins
- [ ] Modal centered properly

## Error Handling Tests

- [ ] Invalid room ID shows error boundary
- [ ] Network failure handled gracefully
- [ ] Form submission errors display properly
- [ ] Console has no errors during normal use

## Performance Tests

- [ ] Page loads in < 3 seconds
- [ ] Interactions feel responsive
- [ ] No layout shifts after load
- [ ] Smooth animations/transitions

## Data Persistence Tests

- [ ] Impact logs persist in session
- [ ] User actions tracked in memoryStore
- [ ] LocalStorage backup works
- [ ] Data survives page refresh

## Accessibility Tests

- [ ] Keyboard navigation works
- [ ] Tab order is logical
- [ ] ARIA labels present
- [ ] Focus indicators visible
- [ ] Screen reader compatible

## Golden Thread Journey Tests

For each of the 8 golden threads, verify:

### Thread 1: Community Garden Initiative
- [ ] News → Chat → Room navigation works
- [ ] Data consistency across journey
- [ ] Impact logging specific to gardens

### Thread 2: Tech Mentorship Program
- [ ] Mentorship-specific quick actions
- [ ] Relevant objectives displayed

### Thread 3: Mental Health Support Network
- [ ] Sensitive content handled appropriately
- [ ] Emergency help action prominent

### Thread 4: Renewable Energy Co-op
- [ ] Energy-specific metrics shown
- [ ] Calculator tool available

### Thread 5: Elder Care Connection
- [ ] Volunteer actions emphasized
- [ ] Accessibility features work

### Thread 6: Youth Sports League
- [ ] Team/game scheduling visible
- [ ] Equipment donation tracked

### Thread 7: Digital Literacy for Seniors
- [ ] Simple, clear interface
- [ ] Help resources prominent

### Thread 8: Local Food Bank Network
- [ ] Food donation tracking
- [ ] Location finder works

## Demo Readiness Checklist

- [ ] All critical paths work
- [ ] No blocking errors
- [ ] Visual polish complete
- [ ] Loading states smooth
- [ ] Error messages user-friendly
- [ ] Impact tracking functional
- [ ] Analytics capture working
- [ ] Mobile experience good
- [ ] Performance acceptable
- [ ] Fallbacks in place

## Known Issues to Document

1. Chat is simulated (not real-time)
2. Authentication bypassed for demo
3. Data resets on server restart

## Testing Sign-off

- Date: ___________
- Tester: ___________
- Build Version: ___________
- All Critical Tests: Pass / Fail
- Demo Ready: Yes / No

## Notes:
_Add any additional observations or issues found during testing_
