import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { ExchangeRatesService } from './services';

@Module({
  imports: [HttpModule],
  providers: [ExchangeRatesService],
  exports: [ExchangeRatesService],
})
export class ExchangeRatesModule {}
