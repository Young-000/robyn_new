import { Routine } from '../entities/Routine';

export interface IRoutineRepository {
  findAll(): Promise<Routine[]>;
  findById(id: string): Promise<Routine | null>;
  save(routine: Routine): Promise<void>;
  delete(id: string): Promise<void>;
}
