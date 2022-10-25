import { Authentication } from '@authentication/entities';
import { ApiProperty } from '@nestjs/swagger';

export class AuthTokenResponse {
  @ApiProperty()
  authentication: Authentication;
  @ApiProperty()
  authToken: string;
}
