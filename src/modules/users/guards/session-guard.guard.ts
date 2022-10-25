import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

import { Authentication } from '@authentication/entities';
import { UsersService } from '@users/services';

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorization = request.user as Authentication;
    if (!authorization) throw new UnauthorizedException('You must log in first');
    const user = await this.usersService.findOne({
      where: { email: authorization.identifier },
      relations: ['authentication'],
    });
    request.user = user;
    return !!user;
  }
}
