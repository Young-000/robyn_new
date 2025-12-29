import { Schedule } from '../value-objects/Schedule';
import { InformationSource } from './InformationSource';

export interface RoutineProps {
  id?: string;
  userId: string;
  name: string;
  schedule: Schedule;
  notificationTime: string;
  enabled?: boolean;
  informationSources?: InformationSource[];
}

export class Routine {
  private constructor(
    public readonly id: string,
    public readonly userId: string,
    private _name: string,
    public readonly schedule: Schedule,
    public readonly notificationTime: string,
    private _enabled: boolean,
    private _informationSources: InformationSource[]
  ) {}

  static create(props: RoutineProps): Routine {
    return new Routine(
      props.id ?? crypto.randomUUID(),
      props.userId,
      props.name,
      props.schedule,
      props.notificationTime,
      props.enabled ?? true,
      props.informationSources ?? []
    );
  }

  static fromData(data: {
    id: string;
    userId: string;
    name: string;
    scheduleTime: string;
    daysOfWeek: number[];
    notificationTime: string;
    enabled: boolean;
    informationSources?: Array<{
      id: string;
      type: string;
      config: any;
      order: number;
    }>;
  }): Routine {
    const schedule = Schedule.create(
      data.scheduleTime,
      data.daysOfWeek as any
    );
    
    const informationSources = (data.informationSources ?? []).map(
      (source) => InformationSource.fromData({
        id: source.id,
        type: source.type as any,
        config: source.config,
        order: source.order,
      })
    );

    return new Routine(
      data.id,
      data.userId,
      data.name,
      schedule,
      data.notificationTime,
      data.enabled,
      informationSources
    );
  }

  get name(): string {
    return this._name;
  }

  get enabled(): boolean {
    return this._enabled;
  }

  get informationSources(): InformationSource[] {
    return [...this._informationSources];
  }

  enable(): void {
    this._enabled = true;
  }

  disable(): void {
    this._enabled = false;
  }

  updateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error('Routine name cannot be empty');
    }
    this._name = name;
  }

  addInformationSource(source: InformationSource): void {
    this._informationSources.push(source);
    this._informationSources.sort((a, b) => a.order - b.order);
  }

  removeInformationSource(sourceId: string): void {
    this._informationSources = this._informationSources.filter(
      (source) => source.id !== sourceId
    );
  }
}
