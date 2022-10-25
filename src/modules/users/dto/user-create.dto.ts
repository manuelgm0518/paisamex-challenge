import { PickType } from '@nestjs/swagger';
import { User } from '@users/entities';

export class UserCreateDto extends PickType(User, ['email', 'firstName', 'lastName'] as const) {}
