import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsPassword, MatchProperty, PASSWORD_DESCRIPTION } from '@shared/decorators';
import { User } from '@users/entities';

export class UserSignUpDto extends PickType(User, ['email', 'firstName', 'lastName'] as const) {
  @IsPassword()
  @ApiProperty({ description: PASSWORD_DESCRIPTION })
  password: string;

  @MatchProperty('password')
  @ApiProperty({ description: "Must match with 'password' field" })
  confirmPassword: string;
}
