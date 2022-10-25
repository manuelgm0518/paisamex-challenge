import { ClassSerializerInterceptor, Global, Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

import { EnvironmentVariables } from './constants';
import { HttpExceptionFilter } from './filters';
import { DatabaseService, EnvironmentService } from './services';
import { AuthenticationModule } from '@authentication/authentication.module';

@Global()
@Module({
  providers: [
    EnvironmentService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
  imports: [
    ConfigModule.forRoot({
      validate: (config: Record<string, unknown>) => {
        const validatedConfig = plainToInstance(EnvironmentVariables, config, {
          enableImplicitConversion: true,
        });
        const errors = validateSync(validatedConfig, {
          skipMissingProperties: false,
        });
        if (errors.length > 0) throw new Error(errors.toString());
        return validatedConfig;
      },
    }),
    TypeOrmModule.forRootAsync({
      useClass: DatabaseService,
    }),
    AuthenticationModule,
  ],
  exports: [EnvironmentService, AuthenticationModule],
})
export class CoreModule {}
