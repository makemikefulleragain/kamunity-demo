# User Acceptance Testing (UAT) Plan
## Kamunity Room Preview Page

### Test Environment
- **URL**: http://localhost:3001
- **Browser**: Chrome/Edge/Firefox (latest)
- **Devices**: Desktop (1920x1080) and Mobile (375x667)
- **Duration**: 30-45 minutes

---

## STEP 1: Initial Setup (2 min)
1. Open browser to http://localhost:3001
2. Verify homepage loads without errors
3. Open browser DevTools Console (F12)
4. Check for any red errors in console
5. **Expected**: Clean console, no errors

---

## STEP 2: Navigate to First Room (3 min)
1. Navigate to: http://localhost:3001/rooms/room-env-1
2. Wait for page to fully load
3. **Verify**:
   - [ ] Hero section shows "Community Garden Initiative"
   - [ ] Member count displays (e.g., "42 members")
   - [ ] Impact score shows (e.g., "850 impact points")
   - [ ] 5 quick action buttons visible

---

## STEP 3: Test Impact Logging (5 min)
1. Click "Log Impact" button (first quick action)
2. **Verify modal opens** with:
   - [ ] Title field
   - [ ] Description field
   - [ ] Impact type dropdown
   - [ ] People helped number input
   
3. **Test validation** (leave fields empty):
   - Click Submit
   - **Expected**: Error messages appear
   
4. **Fill form correctly**:
   - Title: "Planted 20 tomato plants"
   - Description: "Helped 5 families start their gardens"
   - Type: Select "Environmental"
   - People Helped: 5
   
5. Click Submit
6. **Verify**:
   - [ ] Modal closes
   - [ ] Success toast appears (green notification)
   - [ ] No console errors

---

## STEP 4: Test Other Quick Actions (3 min)
1. Click each remaining quick action:
   - [ ] Schedule Meeting
   - [ ] Share Resources
   - [ ] Track Progress
   - [ ] Invite Members
   
2. **Expected for each**: Button responds to click (visual feedback)
3. Check console for tracking messages

---

## STEP 5: Test Chat/AI Tabs (5 min)
1. Locate the Chat/Kai AI section
2. **Group Chat Tab**:
   - [ ] Click "Group Chat" tab
   - [ ] Verify messages display
   - [ ] Check author names visible
   - [ ] Verify timestamps show
   - [ ] See reaction emojis (if any)
   
3. **Kai AI Tab**:
   - [ ] Click "Kai AI" tab
   - [ ] Verify AI messages have different styling
   - [ ] Check for AI suggestions/prompts
   - [ ] Input field present at bottom

---

## STEP 6: Test All 8 Golden Threads (10 min)
Navigate to each room and verify basic functionality:

### Room 1: Community Garden
- URL: `/rooms/room-env-1`
- [ ] Page loads
- [ ] Impact logging works

### Room 2: Tech Mentorship
- URL: `/rooms/room-tech-1`
- [ ] Page loads
- [ ] Relevant objectives shown

### Room 3: Mental Health
- URL: `/rooms/room-health-1`
- [ ] Page loads
- [ ] Emergency help action visible

### Room 4: Renewable Energy
- URL: `/rooms/room-env-2`
- [ ] Page loads
- [ ] Energy-specific actions

### Room 5: Elder Care
- URL: `/rooms/room-social-1`
- [ ] Page loads
- [ ] Volunteer actions present

### Room 6: Youth Sports
- URL: `/rooms/room-social-2`
- [ ] Page loads
- [ ] Team/game actions visible

### Room 7: Digital Literacy
- URL: `/rooms/room-edu-1`
- [ ] Page loads
- [ ] Help resources prominent

### Room 8: Food Bank
- URL: `/rooms/room-social-3`
- [ ] Page loads
- [ ] Donation tracking visible

---

## STEP 7: Mobile Responsiveness (5 min)
1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select "iPhone 12 Pro" preset
4. Navigate to `/rooms/room-env-1`

**Verify Mobile Layout**:
- [ ] Quick actions stack vertically
- [ ] Text remains readable
- [ ] Buttons are tap-friendly (large enough)
- [ ] Modal fits screen properly
- [ ] No horizontal scrolling

---

## STEP 8: Error Handling (3 min)
1. Navigate to invalid room: `/rooms/invalid-room-id`
2. **Expected**: Error boundary shows friendly message
3. Click "Go back" or "Try again" button
4. **Verify**: Returns to working page

---

## STEP 9: Performance Check (2 min)
1. Navigate between 3 different rooms quickly
2. **Verify**:
   - [ ] Pages load within 3 seconds
   - [ ] No white flash between pages
   - [ ] Smooth transitions
   - [ ] No layout shifts

---

## STEP 10: Data Persistence (3 min)
1. Go to `/rooms/room-env-1`
2. Log an impact (Step 3)
3. Navigate to different room
4. Return to `/rooms/room-env-1`
5. Open impact modal again
6. **Note**: Previous entry should be saved (check console/memoryStore)

---

## FINAL VERIFICATION CHECKLIST

### Critical Functions
- [ ] All rooms load without errors
- [ ] Impact logging saves data
- [ ] Quick actions respond
- [ ] Chat displays messages
- [ ] Mobile layout works

### Quality Checks
- [ ] No console errors during normal use
- [ ] Loading time acceptable (< 3 sec)
- [ ] UI elements aligned properly
- [ ] Text is readable
- [ ] Colors/contrast appropriate

### User Experience
- [ ] Clear what each button does
- [ ] Feedback for user actions
- [ ] Error messages helpful
- [ ] Navigation intuitive
- [ ] Mobile experience smooth

---

## SIGN-OFF

**Testing Complete**: ☐

**Issues Found** (if any):
1. _____________________
2. _____________________
3. _____________________

**Overall Assessment**:
- [ ] **PASS** - Ready for demo
- [ ] **PASS WITH NOTES** - Minor issues, but demo-ready
- [ ] **FAIL** - Critical issues need fixing

**Tester Name**: _____________________
**Date/Time**: _____________________
**Notes**: _____________________

---

## Quick Troubleshooting

### If page won't load:
1. Check if dev server running: `npm run dev`
2. Try different port: http://localhost:3001 or 3000
3. Clear browser cache
4. Check .env.local file exists

### If errors in console:
1. Note exact error message
2. Screenshot the error
3. Check which action triggered it
4. Try in incognito mode

### If impact logging fails:
1. Check all fields filled
2. Verify modal opens
3. Check console for errors
4. Try different room

---

## Support
For issues during testing, check:
- `/docs/ROOM_PREVIEW_TESTING_CHECKLIST.md`
- `/docs/DEMO_READINESS_REPORT.md`
- Console logs in browser DevTools
