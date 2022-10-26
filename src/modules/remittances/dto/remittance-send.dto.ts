import { ApiProperty, PickType } from '@nestjs/swagger';
import { Remittance } from '@remittances/entities';
import { IsInt, IsPositive } from 'class-validator';

export class RemittanceSendDto extends PickType(Remittance, [
  'originAmount',
  'originCurrency',
  'destinationCurrency',
] as const) {
  @ApiProperty({ description: 'The Id of the `User` who will receive the remittance' })
  @IsInt()
  @IsPositive()
  receiver: number;
}
