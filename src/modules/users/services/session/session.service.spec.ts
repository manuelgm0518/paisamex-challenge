import { AuthenticationService } from '@authentication/services';
import { CoreModule } from '@core/core.module';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RemittancesModule } from '@remittances/remittances.module';
import { User } from '@users/entities';
import { SessionService } from './session.service';

describe('SessionService', () => {
  let service: SessionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CoreModule, RemittancesModule, TypeOrmModule.forFeature([User])],
      providers: [SessionService],
    }).compile();

    service = module.get<SessionService>(SessionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
