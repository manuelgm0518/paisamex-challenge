import { PickType } from '@nestjs/swagger';
import { RemittanceMovement } from '@remittances/entities';

export class RemittanceUpdateDto extends PickType(RemittanceMovement, ['updatedBy', 'updatedStatus'] as const) {}
