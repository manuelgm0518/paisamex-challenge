import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Environment, EnvironmentVariables } from '@core/constants';

@Injectable()
export class EnvironmentService {
  constructor(private configService: ConfigService) {}

  get isDevelopment(): boolean {
    return this.get('NODE_ENV') === Environment.DEVELOPMENT;
  }

  get isTesting(): boolean {
    return this.get('NODE_ENV') === Environment.TEST;
  }

  get isProduction(): boolean {
    return this.get('NODE_ENV') === Environment.PRODUCTION;
  }

  get version(): string {
    return this.get('VERSION').toString();
  }

  get<K extends keyof EnvironmentVariables, T extends typeof EnvironmentVariables.prototype[K]>(key: K): T {
    return this.configService.get<T>(key);
  }
}
