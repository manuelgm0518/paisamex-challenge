import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

import { EnvironmentService } from '@core/services';
import { Currency } from '@exchange-rates/constants';
import { ConvertResponseDto } from '@exchange-rates/dto';

@Injectable()
export class ExchangeRatesService {
  constructor(private readonly environmentService: EnvironmentService, private readonly httpService: HttpService) {}

  async convert(amount: number, fromCurrency: Currency, toCurrency: Currency): Promise<number> {
    const url =
      this.environmentService.get('EXCHANGE_RATES_API_URL') +
      `convert?to=${toCurrency}&from=${fromCurrency}&amount=${amount}`;
    const { data } = await firstValueFrom(
      this.httpService.get<ConvertResponseDto>(url, {
        headers: {
          apiKey: this.environmentService.get('EXCHANGE_RATES_API_KEY'),
        },
      }),
    );
    return data.result;
  }
}
