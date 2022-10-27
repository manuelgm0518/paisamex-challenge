import { CoreModule } from '@core/core.module';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RemittancesModule } from '@remittances/remittances.module';
import { User } from '@users/entities';
import { SessionService } from '@users/services';
import { SessionController } from './session.controller';

describe('SessionController', () => {
  let controller: SessionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CoreModule, RemittancesModule, TypeOrmModule.forFeature([User])],
      controllers: [SessionController],
      providers: [SessionService],
    }).compile();

    controller = module.get<SessionController>(SessionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
