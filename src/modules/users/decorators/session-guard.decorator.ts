import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@authentication/guards';
import { SessionGuard } from '@users/guards';
import { ApiBearerAuth } from '@nestjs/swagger';

export function UseSessionGuard(): MethodDecorator {
  return applyDecorators(ApiBearerAuth(), UseGuards(JwtAuthGuard, SessionGuard));
}
