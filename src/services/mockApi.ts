// src/services/mockApi.ts
import type { BaseEntity } from '@/types/index';
import { LocalStorageService } from './localStorage';

export class MockApiService<T extends BaseEntity> {
  private storageKey: string;
  private data: T[];

  constructor(storageKey: string, seedData: T[] = []) {
    this.storageKey = storageKey;
    
    // Initialize data from localStorage or use seed data
    const stored = LocalStorageService.get<T[]>(storageKey);
    if (stored && stored.length > 0) {
      this.data = stored;
    } else {
      this.data = seedData;
      this.saveToStorage();
    }
  }

  private saveToStorage(): void {
    LocalStorageService.set(this.storageKey, this.data);
  }

  private generateId(): number {
    return this.data.length > 0 ? Math.max(...this.data.map((item) => item.id)) + 1 : 1;
  }

  private addTimestamps(entity: Partial<T>, isUpdate = false): Partial<T> {
    const now = new Date();
    if (!isUpdate) {
      return {
        ...entity,
        createdAt: now,
        createdBy: 'system',
      };
    }
    return {
      ...entity,
      updatedAt: now,
      updatedBy: 'system',
    };
  }

  async getAll(): Promise<T[]> {
    // Simulate API delay
    await this.delay(100);
    return [...this.data];
  }

  async getById(id: number): Promise<T | null> {
    await this.delay(100);
    const item = this.data.find((item) => item.id === id);
    return item ? { ...item } : null;
  }

  async create(entity: Omit<T, 'id' | 'createdAt' | 'createdBy'>): Promise<T> {
    await this.delay(200);
    const newEntity = {
      ...entity,
      id: this.generateId(),
      ...this.addTimestamps(entity as Partial<T>),
    } as T;
    
    this.data.push(newEntity);
    this.saveToStorage();
    return { ...newEntity };
  }

  async update(id: number, entity: Partial<T>): Promise<T | null> {
    await this.delay(200);
    const index = this.data.findIndex((item) => item.id === id);
    
    if (index === -1) {
      return null;
    }

    const updated = {
      ...this.data[index],
      ...entity,
      id, // Ensure id doesn't change
      ...this.addTimestamps(entity, true),
    } as T;

    this.data[index] = updated;
    this.saveToStorage();
    return { ...updated };
  }

  async delete(id: number): Promise<boolean> {
    await this.delay(200);
    const index = this.data.findIndex((item) => item.id === id);
    
    if (index === -1) {
      return false;
    }

    this.data.splice(index, 1);
    this.saveToStorage();
    return true;
  }

  async search(predicate: (item: T) => boolean): Promise<T[]> {
    await this.delay(100);
    return this.data.filter(predicate);
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Utility method to reset data
  reset(seedData: T[] = []): void {
    this.data = seedData;
    this.saveToStorage();
  }

  // Get current data without API delay
  getData(): T[] {
    return [...this.data];
  }
}