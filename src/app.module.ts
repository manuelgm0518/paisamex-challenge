import { Module } from '@nestjs/common';

import { CoreModule } from '@core/core.module';
import { UsersModule } from '@users/users.module';
import { RemittancesModule } from './modules/remittances/remittances.module';

@Module({
  imports: [CoreModule, UsersModule, RemittancesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
