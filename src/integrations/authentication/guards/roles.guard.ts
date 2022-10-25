import { AuthRole } from '@authentication/constants';
import { ROLES_KEY } from '@authentication/decorators';
import { Authentication } from '@authentication/entities';
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<AuthRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) return true;
    const { user: authentication } = <{ user: Authentication }>context.switchToHttp().getRequest();
    const hasRole = requiredRoles.some((requiredRole) =>
      authentication.roles.find((role) => role.name == requiredRole),
    );
    if (!hasRole) throw new UnauthorizedException("You don't have the required role");
    return true;
  }
}
