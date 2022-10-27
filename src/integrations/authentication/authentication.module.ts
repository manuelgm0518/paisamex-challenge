import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EnvironmentService } from '@core/services';
import { AuthenticationService } from './services';
import { Authentication, Role } from './entities';
import { JwtAuthStrategy, LocalAuthStrategy } from './strategies';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [EnvironmentService],
      useFactory: (environmentService: EnvironmentService) => ({
        secret: environmentService.get('JWT_SECRET'),
        signOptions: { expiresIn: environmentService.get('JWT_EXPIRATION_TIME') },
      }),
    }),
    TypeOrmModule.forFeature([Authentication, Role]),
  ],
  providers: [AuthenticationService, LocalAuthStrategy, JwtAuthStrategy],
  exports: [AuthenticationService, TypeOrmModule],
})
export class AuthenticationModule {}
