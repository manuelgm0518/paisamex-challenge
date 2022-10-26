import { Authentication } from '@authentication/entities';
import { ApiProperty } from '@nestjs/swagger';

export class AuthTokenResponse {
  @ApiProperty({ type: () => Authentication })
  authentication: Authentication;

  @ApiProperty()
  authToken: string;
}
