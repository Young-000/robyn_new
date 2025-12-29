import type { DayOfWeek } from '@/shared/types';

export class Schedule {
  private constructor(
    public readonly time: string,
    public readonly daysOfWeek: DayOfWeek[]
  ) {
    this.validate();
  }

  static create(time: string, daysOfWeek: DayOfWeek[]): Schedule {
    return new Schedule(time, daysOfWeek);
  }

  private validate(): void {
    // 시간 형식 검증 (HH:mm)
    const timeRegex = /^([01][0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(this.time)) {
      throw new Error('Invalid time format. Expected HH:mm');
    }

    // 요일 검증
    if (this.daysOfWeek.length === 0) {
      throw new Error('At least one day of week must be specified');
    }

    for (const day of this.daysOfWeek) {
      if (day < 0 || day > 6) {
        throw new Error(`Invalid day of week: ${day}. Must be between 0-6`);
      }
    }
  }

  matches(date: Date): boolean {
    const dayOfWeek = date.getDay() as DayOfWeek;
    const timeStr = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;

    return (
      this.daysOfWeek.includes(dayOfWeek) && 
      this.time === timeStr
    );
  }
}
