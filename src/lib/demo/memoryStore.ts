// Persistent memory store using localStorage for cross-tab communication
class MemoryStore {
  private store: Map<string, any> = new Map();
  private events: Array<{ event: string; data: any; timestamp: Date }> = [];
  private storageKey = 'kamunity-demo-store';
  private eventsKey = 'kamunity-demo-events';

  constructor() {
    this.loadFromStorage();
  }

  // Load data from localStorage
  private loadFromStorage(): void {
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
    try {
      const storeObject = Object.fromEntries(this.store);
      localStorage.setItem(this.storageKey, JSON.stringify(storeObject));
      localStorage.setItem(this.eventsKey, JSON.stringify(this.events));
      
      // Trigger storage event for cross-tab communication
      window.dispatchEvent(new StorageEvent('storage', {
        key: this.storageKey,
        newValue: JSON.stringify(storeObject),
        storageArea: localStorage
      }));
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
}

// Export singleton instance
export const memoryStore = new MemoryStore();
