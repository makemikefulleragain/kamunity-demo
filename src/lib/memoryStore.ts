/**
 * In-memory store for demo data with backup capability
 * Persists: surveys, room specs, user tracking
 * Temporary: chat simulations, general browsing
 */

interface SurveyData {
  id: string;
  responses: any;
  email?: string;
  timestamp: Date;
}

interface RoomSpec {
  id: string;
  name: string;
  description: string;
  objectives: string[];
  createdBy: string;
  timestamp: Date;
}

interface UserTracking {
  sessionId: string;
  actions: Array<{
    type: string;
    target: string;
    timestamp: Date;
    metadata?: any;
  }>;
}

interface ImpactLog {
  id: string;
  roomId: string;
  userId: string;
  description: string;
  metrics: {
    type: string;
    value: number;
    unit: string;
  }[];
  timestamp: Date;
}

class MemoryStore {
  private surveys: Map<string, SurveyData> = new Map();
  private roomSpecs: Map<string, RoomSpec> = new Map();
  private userTracking: Map<string, UserTracking> = new Map();
  private impactLogs: Map<string, ImpactLog> = new Map();
  private tempChats: Map<string, any> = new Map();

  // Persistent data methods
  addSurvey(survey: SurveyData) {
    this.surveys.set(survey.id, survey);
    this.backupToLocalStorage('surveys', Array.from(this.surveys.entries()));
  }

  addRoomSpec(spec: RoomSpec) {
    this.roomSpecs.set(spec.id, spec);
    this.backupToLocalStorage('roomSpecs', Array.from(this.roomSpecs.entries()));
  }

  trackUserAction(sessionId: string, action: any) {
    if (!this.userTracking.has(sessionId)) {
      this.userTracking.set(sessionId, {
        sessionId,
        actions: []
      });
    }
    const tracking = this.userTracking.get(sessionId)!;
    tracking.actions.push({
      ...action,
      timestamp: new Date()
    });
    this.backupToLocalStorage('userTracking', Array.from(this.userTracking.entries()));
  }

  addImpactLog(log: ImpactLog) {
    this.impactLogs.set(log.id, log);
    this.backupToLocalStorage('impactLogs', Array.from(this.impactLogs.entries()));
  }

  // Temporary data methods (not backed up)
  setTempChat(chatId: string, messages: any[]) {
    this.tempChats.set(chatId, messages);
  }

  getTempChat(chatId: string) {
    return this.tempChats.get(chatId) || [];
  }

  // Export methods for data retrieval
  exportSurveys() {
    return Array.from(this.surveys.values());
  }

  exportRoomSpecs() {
    return Array.from(this.roomSpecs.values());
  }

  exportUserTracking() {
    return Array.from(this.userTracking.values());
  }

  exportImpactLogs() {
    return Array.from(this.impactLogs.values());
  }

  // Backup to localStorage
  private backupToLocalStorage(key: string, data: any) {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`kamunity_${key}`, JSON.stringify(data));
      } catch (e) {
        console.warn('Failed to backup to localStorage:', e);
      }
    }
  }

  // Restore from localStorage
  restoreFromLocalStorage() {
    if (typeof window !== 'undefined') {
      try {
        const surveys = localStorage.getItem('kamunity_surveys');
        if (surveys) {
          this.surveys = new Map(JSON.parse(surveys));
        }

        const roomSpecs = localStorage.getItem('kamunity_roomSpecs');
        if (roomSpecs) {
          this.roomSpecs = new Map(JSON.parse(roomSpecs));
        }

        const tracking = localStorage.getItem('kamunity_userTracking');
        if (tracking) {
          this.userTracking = new Map(JSON.parse(tracking));
        }

        const impacts = localStorage.getItem('kamunity_impactLogs');
        if (impacts) {
          this.impactLogs = new Map(JSON.parse(impacts));
        }
      } catch (e) {
        console.warn('Failed to restore from localStorage:', e);
      }
    }
  }

  // Get session ID (creates one if doesn't exist)
  getSessionId(): string {
    if (typeof window !== 'undefined') {
      let sessionId = sessionStorage.getItem('kamunity_session_id');
      if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        sessionStorage.setItem('kamunity_session_id', sessionId);
      }
      return sessionId;
    }
    return 'server_session';
  }
}

// Singleton instance
export const memoryStore = new MemoryStore();

// Initialize on client side
if (typeof window !== 'undefined') {
  memoryStore.restoreFromLocalStorage();
}
