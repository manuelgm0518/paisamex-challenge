import { CoreModule } from '@core/core.module';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Remittance, RemittanceMovement } from '@remittances/entities';
import { RemittancesService } from '@remittances/services';
import { UsersModule } from '@users/users.module';
import { RemittancesController } from './remittances.controller';

describe('RemittancesController', () => {
  let controller: RemittancesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CoreModule, UsersModule, TypeOrmModule.forFeature([Remittance, RemittanceMovement])],
      controllers: [RemittancesController],
      providers: [RemittancesService],
    }).compile();

    controller = module.get<RemittancesController>(RemittancesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
