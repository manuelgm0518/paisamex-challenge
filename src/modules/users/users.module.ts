import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SessionController, UsersController } from './controllers';
import { SessionService, UsersService } from './services';
import { User } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController, SessionController],
  providers: [UsersService, SessionService],
  exports: [UsersService, SessionService],
})
export class UsersModule {}
