import { Authentication, Role } from '@authentication/entities';
import { JwtAuthStrategy, LocalAuthStrategy } from '@authentication/strategies';
import { CoreModule } from '@core/core.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationService } from './authentication.service';

describe('AuthenticationService', () => {
  let service: AuthenticationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CoreModule, PassportModule, JwtModule, TypeOrmModule.forFeature([Authentication, Role])],
      providers: [AuthenticationService, LocalAuthStrategy, JwtAuthStrategy],
    }).compile();
    service = module.get<AuthenticationService>(AuthenticationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
