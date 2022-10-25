import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthenticationService } from '@authentication/services';
import { Authentication } from '@authentication/entities';

@Injectable()
export class LocalAuthStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthenticationService) {
    super({ usernameField: 'email' });
  }
  async validate(email: string, password: string): Promise<Authentication> {
    const registry = await this.authService.validateByCredentials(email, password);
    return registry;
  }
}
