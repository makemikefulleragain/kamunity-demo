// Simple in-memory store for demo purposes
class MemoryStore {
  private store: Map<string, any> = new Map();
  private events: Array<{ event: string; data: any; timestamp: Date }> = [];

  // Store data with a key
  set(key: string, value: any): void {
    this.store.set(key, value);
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
    return this.store.delete(key);
  }

  // Clear all data
  clear(): void {
    this.store.clear();
    this.events = [];
  }

  // Track events for analytics
  track(event: string, data: any = {}): void {
    this.events.push({
      event,
      data,
      timestamp: new Date()
    });
  }

  // Get all tracked events
  getEvents(): Array<{ event: string; data: any; timestamp: Date }> {
    return this.events;
  }

  // Get all stored keys
  keys(): string[] {
    return Array.from(this.store.keys());
  }
}

// Export singleton instance
export const memoryStore = new MemoryStore();
