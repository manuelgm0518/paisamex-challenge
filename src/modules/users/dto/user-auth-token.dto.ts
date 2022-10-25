import { ApiProperty } from '@nestjs/swagger';
import { User } from '@users/entities';

export class UserAuthTokenDto {
  @ApiProperty({ description: 'Model containing logged in `User` information' })
  user: User;

  @ApiProperty({ description: 'Authentication token required to validate protected endpoints' })
  authToken: string;
}
