// Persistent memory store using localStorage for cross-tab communication
class MemoryStore {
  private store: Map<string, any> = new Map();
  private events: Array<{ event: string; data: any; timestamp: Date }> = [];
  private storageKey = 'kamunity-demo-store';
  private eventsKey = 'kamunity-demo-events';
  private isClient = false;

  constructor() {
    // Only initialize localStorage on client side
    if (typeof window !== 'undefined') {
      this.isClient = true;
      this.loadFromStorage();
      this.setupStorageListener();
    }
  }

  // Setup cross-tab communication listener
  private setupStorageListener(): void {
    if (!this.isClient) return;
    
    window.addEventListener('storage', (e) => {
      if (e.key === this.storageKey && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          this.store = new Map(Object.entries(parsed));
          console.log('🔄 MemoryStore synced from another tab');
        } catch (error) {
          console.warn('Failed to sync from storage event:', error);
        }
      }
    });
  }

  // Load data from localStorage
  private loadFromStorage(): void {
    if (!this.isClient) return;
    
    try {
      const storedData = localStorage.getItem(this.storageKey);
      if (storedData) {
        const parsed = JSON.parse(storedData);
        this.store = new Map(Object.entries(parsed));
      }

      const storedEvents = localStorage.getItem(this.eventsKey);
      if (storedEvents) {
        this.events = JSON.parse(storedEvents);
      }
    } catch (error) {
      console.warn('Failed to load from localStorage:', error);
    }
  }

  // Save data to localStorage
  private saveToStorage(): void {
    if (!this.isClient) return;
    
    try {
      const storeObject = Object.fromEntries(this.store);
      localStorage.setItem(this.storageKey, JSON.stringify(storeObject));
      localStorage.setItem(this.eventsKey, JSON.stringify(this.events));
      
      // Natural storage event will trigger for other tabs
      // No need to manually dispatch as it can cause loops
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  }

  // Store data with a key
  set(key: string, value: any): void {
    this.store.set(key, value);
    this.saveToStorage();
  }

  // Retrieve data by key
  get(key: string): any {
    return this.store.get(key);
  }

  // Check if key exists
  has(key: string): boolean {
    return this.store.has(key);
  }

  // Delete a key
  delete(key: string): boolean {
    const result = this.store.delete(key);
    if (result) {
      this.saveToStorage();
    }
    return result;
  }

  // Clear all data
  clear(): void {
    this.store.clear();
    this.events = [];
    this.saveToStorage();
  }

  // Track events for analytics
  track(event: string, data: any = {}): void {
    this.events.push({
      event,
      data,
      timestamp: new Date()
    });
    this.saveToStorage();
  }

  // Get all tracked events
  getEvents(): Array<{ event: string; data: any; timestamp: Date }> {
    return this.events;
  }

  // Get all stored keys
  keys(): string[] {
    // Refresh from storage before returning keys
    this.loadFromStorage();
    return Array.from(this.store.keys());
  }

  // Force refresh from localStorage
  refresh(): void {
    this.loadFromStorage();
  }

  // Get storage status for debugging
  getStorageStatus(): { isClient: boolean; storeSize: number; eventsCount: number } {
    return {
      isClient: this.isClient,
      storeSize: this.store.size,
      eventsCount: this.events.length
    };
  }
}

// Export singleton instance
export const memoryStore = new MemoryStore();
