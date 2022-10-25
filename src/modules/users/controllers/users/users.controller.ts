import { Body, Controller, Param } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';

import { ApiDelete, ApiGet, ApiPatch, ApiPost } from '@shared/decorators';
import { API_ENDPOINTS, IHttpResponse } from '@core/constants';
import { User } from '@users/entities';
import { UsersService } from '@users/services';
import { UserCreateDto, UserUpdateDto } from '@users/dto';
import { CurrentAuth } from '@authentication/decorators';
import { UseSessionGuard } from '@users/decorators';
import { ALL_ROLES, ALL_ROLES_EXCEPT, AuthRole } from '@authentication/constants';

@ApiTags('Users')
@Controller(API_ENDPOINTS.USERS.BASE_PATH)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiPost({
    roles: ALL_ROLES_EXCEPT(AuthRole.REGULAR),
    summary: 'Create a new `User`',
    description: 'Stores a new `User` record into the database',
    responseDescription: 'A model containing the newly created `User` information',
    responseType: User,
  })
  async create(@Body() dto: UserCreateDto): Promise<IHttpResponse<User>> {
    const data = await this.usersService.create(dto);
    return { data };
  }

  @ApiGet({
    roles: ALL_ROLES_EXCEPT(AuthRole.REGULAR),
    summary: 'Get all `Users`',
    description: 'Retrieves a list containing every `User` record in the database',
    responseDescription: 'A list of models containing the information of every `User` in the database',
    responseType: [User],
  })
  @UseSessionGuard()
  async find(@CurrentAuth() user: User): Promise<IHttpResponse<User[]>> {
    console.log(user);
    const data = await this.usersService.find();
    return { data };
  }

  @ApiGet({
    path: API_ENDPOINTS.USERS.BY_ID,
    roles: ALL_ROLES,
    summary: 'Get a `User` by Id',
    description: 'Retrieves an `User` record that matches the Id',
    responseDescription: 'A model containing the information of the matched `User`',
    responseType: User,
  })
  @ApiParam({ name: 'id', type: Number })
  async findById(@Param('id') id: number): Promise<IHttpResponse<User>> {
    const data = await this.usersService.findOne({ where: { id } });
    return { data };
  }

  @ApiPatch({
    path: API_ENDPOINTS.USERS.BY_ID,
    roles: [AuthRole.ADMIN],
    summary: 'Update an `User` by Id',
    description: 'Updates an `User` record that matches the Id',
    responseDescription: 'A model containing the updated information of the matched `User`',
    responseType: User,
  })
  @ApiParam({ name: 'id', type: Number })
  async updateById(@Param('id') id: number, @Body() body: UserUpdateDto): Promise<IHttpResponse<User>> {
    const data = await this.usersService.updateById(id, body);
    return { data };
  }

  @ApiDelete({
    path: API_ENDPOINTS.USERS.BY_ID,
    roles: [AuthRole.ADMIN],
    summary: 'Delete an `User` by Id',
    description: 'Deletes an `User` record that matches the Id',
    responseDescription: 'A model containing the information of the deleted `User`',
    responseType: User,
  })
  @ApiParam({ name: 'id', type: Number })
  async deleteById(@Param('id') id: number): Promise<IHttpResponse<User>> {
    const data = await this.usersService.deleteById(id);
    return { data };
  }
}
