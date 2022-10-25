import { Authentication } from '@authentication/entities/authentication.entity';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsPassword, PASSWORD_DESCRIPTION } from '@shared/decorators';

export class AuthenticationSignUpDto extends PickType(Authentication, ['identifier'] as const) {
  @IsPassword()
  @ApiProperty({ description: PASSWORD_DESCRIPTION })
  plainTextPassword: string;
}
