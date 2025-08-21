// Enhanced analytics for tracking user journey through golden threads
import { trackEngagement as demoTrackEngagement } from '../demo/analytics';

interface JourneyStep {
  hub: string;
  contentId: string;
  goldenThread?: string;
  timestamp: Date;
  engagementTime: number;
}

interface UserJourney {
  sessionId: string;
  steps: JourneyStep[];
  goldenThreads: Set<string>;
  completedPaths: string[];
  currentHub: string;
  startTime: Date;
}

class JourneyTracker {
  private journey: UserJourney;
  private stepStartTime: Date;

  constructor(sessionId: string) {
    this.journey = {
      sessionId,
      steps: [],
      goldenThreads: new Set(),
      completedPaths: [],
      currentHub: '',
      startTime: new Date()
    };
    this.stepStartTime = new Date();
  }

  trackHubVisit(hub: string, contentId?: string, goldenThread?: string) {
    const now = new Date();
    const engagementTime = now.getTime() - this.stepStartTime.getTime();

    // Record previous step if exists
    if (this.journey.currentHub) {
      this.journey.steps.push({
        hub: this.journey.currentHub,
        contentId: contentId || 'hub-overview',
        goldenThread,
        timestamp: this.stepStartTime,
        engagementTime
      });
    }

    // Update current state
    this.journey.currentHub = hub;
    this.stepStartTime = now;

    if (goldenThread) {
      this.journey.goldenThreads.add(goldenThread);
      this.checkForCompletedPaths(goldenThread, hub);
    }

    // Track with existing analytics
    demoTrackEngagement('hub_visit');
  }

  trackContentEngagement(contentId: string, engagementType: string, goldenThread?: string) {
    demoTrackEngagement('content_engagement');
  }

  trackGoldenThreadProgression(fromHub: string, toHub: string, goldenThread: string) {
    demoTrackEngagement('golden_thread_progression');
  }

  trackFocusRoomGeneration(roomData: {
    roomName: string;
    keyFeatures: string[];
    [key: string]: any;
  }) {
    demoTrackEngagement('focus_room_generated');
  }

  private checkForCompletedPaths(goldenThread: string, currentHub: string) {
    const hubOrder = ['news', 'chat', 'rooms', 'clubs', 'communities'];
    const threadSteps = this.journey.steps.filter(step => step.goldenThread === goldenThread);
    
    // Check if user has followed a complete golden thread path
    const visitedHubs = new Set(threadSteps.map(step => step.hub));
    visitedHubs.add(currentHub);
    
    let consecutiveHubs = 0;
    let startIndex = -1;
    
    for (let i = 0; i < hubOrder.length; i++) {
      if (visitedHubs.has(hubOrder[i])) {
        if (startIndex === -1) startIndex = i;
        consecutiveHubs++;
      } else if (consecutiveHubs > 0) {
        break;
      }
    }

    // Track completed paths (3+ consecutive hubs in golden thread)
    if (consecutiveHubs >= 3) {
      const pathKey = `${goldenThread}-${startIndex}-${consecutiveHubs}`;
      if (!this.journey.completedPaths.includes(pathKey)) {
        this.journey.completedPaths.push(pathKey);
        
        demoTrackEngagement('golden_thread_completed');
      }
    }
  }

  getJourneyStats() {
    return {
      totalSteps: this.journey.steps.length,
      goldenThreadsFollowed: Array.from(this.journey.goldenThreads),
      completedPaths: this.journey.completedPaths.length,
      sessionDuration: new Date().getTime() - this.journey.startTime.getTime(),
      averageEngagementTime: this.journey.steps.length > 0 
        ? this.journey.steps.reduce((sum, step) => sum + step.engagementTime, 0) / this.journey.steps.length
        : 0
    };
  }
}

// Global journey tracker instance
let globalJourneyTracker: JourneyTracker | null = null;

export const initializeJourneyTracking = (sessionId: string) => {
  globalJourneyTracker = new JourneyTracker(sessionId);
  return globalJourneyTracker;
};

export const getJourneyTracker = () => {
  if (!globalJourneyTracker) {
    // Initialize with a default session ID if not already initialized
    const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    globalJourneyTracker = new JourneyTracker(sessionId);
  }
  return globalJourneyTracker;
};

// Convenience functions
export const trackHubVisit = (hub: string, contentId?: string, goldenThread?: string) => {
  getJourneyTracker().trackHubVisit(hub, contentId, goldenThread);
};

export const trackEngagement = (action: string, data?: any) => {
  demoTrackEngagement(action, data?.engagementLevel);
};

export const trackContentEngagement = (contentId: string, engagementType: string, goldenThread?: string) => {
  getJourneyTracker().trackContentEngagement(contentId, engagementType, goldenThread);
};

export const trackGoldenThreadProgression = (fromHub: string, toHub: string, goldenThread: string) => {
  getJourneyTracker().trackGoldenThreadProgression(fromHub, toHub, goldenThread);
};

export const trackFocusRoomGeneration = (roomData: any) => {
  getJourneyTracker().trackFocusRoomGeneration(roomData);
};

export const getJourneyStats = () => {
  return getJourneyTracker().getJourneyStats();
};
