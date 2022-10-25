import { applyDecorators, Delete, Get, HttpCode, HttpStatus, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { startCase } from 'lodash';

import { API_RESPONSES } from '@core/constants';
import { UseSessionGuard } from '@users/decorators';
import { Roles } from '@authentication/decorators';
import { AuthRole } from '@authentication/constants';
import { JwtAuthGuard, RolesGuard } from '@authentication/guards';

interface ApiMethodParams {
  path?: string;
  roles?: AuthRole[];
  summary?: string;
  description?: string;
  responseType?: any;
  responseDescription?: string;
}

function ApiMethod(params?: ApiMethodParams): MethodDecorator {
  const roles = params?.roles ? '[' + params.roles.map((e) => startCase(e)).join('/') + '] ' : '';
  const decorators = [
    ApiOperation({
      summary: roles + (params?.summary ?? ''),
      description: params?.description,
    }),
    ApiOkResponse({
      type: params?.responseType,
      description: params?.responseDescription,
    }),
    ApiResponse(API_RESPONSES.COMMON_ERROR),
    ...(params?.roles
      ? [ApiBearerAuth(), UseGuards(JwtAuthGuard, RolesGuard), Roles(...params.roles), UseSessionGuard()]
      : []),
  ];
  return applyDecorators(...decorators);
}

export function ApiPost(params?: ApiMethodParams): MethodDecorator {
  return applyDecorators(Post(params?.path), ApiMethod(params), HttpCode(HttpStatus.OK));
}

export function ApiGet(params?: ApiMethodParams): MethodDecorator {
  return applyDecorators(Get(params?.path), ApiMethod(params));
}

export function ApiPatch(params?: ApiMethodParams): MethodDecorator {
  return applyDecorators(Patch(params?.path), ApiMethod(params), HttpCode(HttpStatus.OK));
}

export function ApiPut(params?: ApiMethodParams): MethodDecorator {
  return applyDecorators(Put(params?.path), ApiMethod(params), HttpCode(HttpStatus.OK));
}

export function ApiDelete(params?: ApiMethodParams): MethodDecorator {
  return applyDecorators(Delete(params?.path), ApiMethod(params), ApiOkResponse(API_RESPONSES.DELETION));
}
