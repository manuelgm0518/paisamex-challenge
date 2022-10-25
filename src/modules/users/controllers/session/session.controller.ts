import { Body, Controller, UseGuards } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';

import { CurrentAuth } from '@authentication/decorators';
import { Authentication } from '@authentication/entities';
import { LocalAuthGuard } from '@authentication/guards';
import { API_ENDPOINTS, API_VERSIONS, IHttpResponse } from '@core/constants';
import { UserAuthTokenDto, UserLogInDto, UserSignUpDto } from '@users/dto';
import { SessionService } from '@users/services';
import { AuthTokenResponse } from '@authentication/constants';
import { ApiPost } from '@shared/decorators';

@ApiTags('Session')
@Controller({ path: API_ENDPOINTS.USERS.SESSION.BASE_PATH, version: API_VERSIONS.V1 })
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @ApiPost({
    path: API_ENDPOINTS.USERS.SESSION.LOG_IN,
    summary: 'Access into the `User` account',
    description: 'Creates a session and retrieves the logged in `User` information',
    responseDescription: 'An Object containing the logged in `User` information along with its authentication token',
    responseType: UserAuthTokenDto,
  })
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: UserLogInDto })
  async logIn(@CurrentAuth() authentication: Authentication): Promise<IHttpResponse<UserAuthTokenDto>> {
    const data = await this.sessionService.logIn(authentication.identifier);
    return { data };
  }

  @ApiPost({
    path: API_ENDPOINTS.USERS.SESSION.SIGN_UP,
    summary: 'Create a new `User` account',
    description: 'Creates a new `User` along with its log in credentials',
    responseDescription: 'An Object containing the logged in `User` information along with its authentication token',
    responseType: AuthTokenResponse,
  })
  async signUp(@Body() body: UserSignUpDto): Promise<IHttpResponse<UserAuthTokenDto>> {
    const data = await this.sessionService.signUp(body);
    return { data };
  }
}
