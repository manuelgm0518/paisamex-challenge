import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '@users/users.module';

import { RemittancesController } from './controllers';
import { Remittance, RemittanceMovement } from './entities';
import { RemittancesService } from './services';

@Module({
  imports: [TypeOrmModule.forFeature([Remittance, RemittanceMovement]), forwardRef(() => UsersModule)],
  controllers: [RemittancesController],
  providers: [RemittancesService],
  exports: [RemittancesService],
})
export class RemittancesModule {}
