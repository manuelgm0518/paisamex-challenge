import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AuthenticationService } from '@authentication/services';
import { EnvironmentService } from '@core/services';
import { IDecodedToken } from '@authentication/constants';
import { Authentication } from '@authentication/entities';

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly environmentService: EnvironmentService,
    private readonly authService: AuthenticationService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: environmentService.get('JWT_SECRET'),
      ignoreExpiration: !environmentService.isProduction,
    });
  }

  async validate(payload: IDecodedToken): Promise<Authentication> {
    const registry = await this.authService.validateByToken(payload);
    return registry;
  }
}
