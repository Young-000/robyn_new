import type { InformationSourceType } from '@/shared/types';

export interface InformationSourceConfig {
  [key: string]: any;
}

export class InformationSource {
  private constructor(
    public readonly id: string,
    public readonly type: InformationSourceType,
    public readonly config: InformationSourceConfig,
    public readonly order: number
  ) {}

  static create(params: {
    type: InformationSourceType;
    config: InformationSourceConfig;
    order?: number;
  }): InformationSource {
    return new InformationSource(
      crypto.randomUUID(),
      params.type,
      params.config,
      params.order ?? 0
    );
  }

  static fromData(data: {
    id: string;
    type: InformationSourceType;
    config: InformationSourceConfig;
    order: number;
  }): InformationSource {
    return new InformationSource(
      data.id,
      data.type,
      data.config,
      data.order
    );
  }

  updateConfig(config: InformationSourceConfig): InformationSource {
    return new InformationSource(
      this.id,
      this.type,
      config,
      this.order
    );
  }

  updateOrder(order: number): InformationSource {
    return new InformationSource(
      this.id,
      this.type,
      this.config,
      order
    );
  }
}
