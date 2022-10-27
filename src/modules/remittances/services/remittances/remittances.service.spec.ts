import { CoreModule } from '@core/core.module';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Remittance, RemittanceMovement } from '@remittances/entities';
import { UsersModule } from '@users/users.module';
import { RemittancesService } from './remittances.service';

describe('RemittancesService', () => {
  let service: RemittancesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CoreModule, UsersModule, TypeOrmModule.forFeature([Remittance, RemittanceMovement])],
      providers: [RemittancesService],
    }).compile();

    service = module.get<RemittancesService>(RemittancesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
