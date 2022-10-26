import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SessionController, UsersController } from './controllers';
import { SessionService, UsersService } from './services';
import { User } from './entities';
import { RemittancesModule } from '@remittances/remittances.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => RemittancesModule)],
  controllers: [UsersController, SessionController],
  providers: [UsersService, SessionService],
  exports: [UsersService, SessionService],
})
export class UsersModule {}
