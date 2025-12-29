import { Routine } from '@/domain/entities/Routine';
import type { IRoutineRepository } from '@/domain/interfaces/IRoutineRepository';

const STORAGE_KEY = 'routines';

export class LocalStorageRoutineRepository implements IRoutineRepository {
  private routines: Routine[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        this.routines = data.map((r: any) => Routine.fromData(r));
      }
    } catch (error) {
      console.error('Failed to load routines from storage:', error);
      this.routines = [];
    }
  }

  private saveToStorage(): void {
    try {
      const data = this.routines.map((r) => ({
        id: r.id,
        userId: r.userId,
        name: r.name,
        scheduleTime: r.schedule.time,
        daysOfWeek: r.schedule.daysOfWeek,
        notificationTime: r.notificationTime,
        enabled: r.enabled,
        informationSources: r.informationSources.map((s) => {
          // InformationSource의 config 접근
          const sourceData = s as any;
          return {
            id: s.id,
            type: s.type,
            config: sourceData.config || {},
            order: s.order,
          };
        }),
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save routines to storage:', error);
    }
  }

  async findAll(): Promise<Routine[]> {
    return [...this.routines];
  }

  async findById(id: string): Promise<Routine | null> {
    return this.routines.find((r) => r.id === id) || null;
  }

  async save(routine: Routine): Promise<void> {
    const index = this.routines.findIndex((r) => r.id === routine.id);
    if (index >= 0) {
      this.routines[index] = routine;
    } else {
      this.routines.push(routine);
    }
    this.saveToStorage();
  }

  async delete(id: string): Promise<void> {
    this.routines = this.routines.filter((r) => r.id !== id);
    this.saveToStorage();
  }
}
