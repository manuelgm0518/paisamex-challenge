import { Body, Controller, Param, ParseIntPipe } from '@nestjs/common';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';

import { ApiGet, ApiPatch, ApiPost } from '@shared/decorators';
import { API_ENDPOINTS, IHttpResponse } from '@core/constants';
import { Remittance, RemittanceMovement } from '@remittances/entities';
import { RemittancesService } from '@remittances/services';
import { CurrentAuth } from '@authentication/decorators';
import { ALL_ROLES, AuthRole } from '@authentication/constants';
import { RemittanceSendDto } from '@remittances/dto';
import { User } from '@users/entities';
import { RemittanceStatus } from '@remittances/constants';

@ApiTags('Remittances')
@Controller(API_ENDPOINTS.REMITTANCES.BASE_PATH)
export class RemittancesController {
  constructor(private readonly remittancesService: RemittancesService) {}

  @ApiPost({
    path: API_ENDPOINTS.REMITTANCES.SEND,
    roles: [AuthRole.REGULAR],
    summary: 'Create a new `Remittance`',
    description: 'Stores a new `Remittance` record into the database',
    responseDescription: 'A model containing the newly created `Remittance` information',
    responseType: Remittance,
  })
  @ApiBody({ type: RemittanceSendDto })
  async send(@Body() body: RemittanceSendDto, @CurrentAuth() currentUser: User): Promise<IHttpResponse<Remittance>> {
    const data = await this.remittancesService.create(currentUser, body);
    return { data };
  }

  @ApiGet({
    roles: ALL_ROLES,
    summary: 'Get all `Remittances`',
    description:
      'Retrieves a list containing every `Remittance` record in the database. If you are not an Admin user, it only returns the `Remittances` that are related to the current logged in user',
    responseDescription: 'A list of models containing the information of every `Remittance` in the database.',
    responseType: [Remittance],
  })
  async findAll(@CurrentAuth() currentUser: User): Promise<IHttpResponse<Remittance[]>> {
    const data = await this.remittancesService.find(
      !currentUser.roles.includes(AuthRole.ADMIN)
        ? { where: [{ sender: { id: currentUser.id } }, { receiver: { id: currentUser.id } }] }
        : {},
    );
    return { data };
  }

  @ApiGet({
    path: API_ENDPOINTS.REMITTANCES.BY_ID,
    roles: ALL_ROLES,
    summary: 'Get a `Remittance` by Id',
    description:
      'Retrieves a `Remittance` record that matches the Id. If you are not an Admin user, the `Remittance` must be related to the current logged in user',
    responseDescription: 'A model containing the information of the matched `Remittance`.',
    responseType: Remittance,
  })
  @ApiParam({ name: 'id', type: Number })
  async findById(
    @Param('id', ParseIntPipe) id: number,
    @CurrentAuth() currentUser: User,
  ): Promise<IHttpResponse<Remittance>> {
    let data: Remittance;
    if (currentUser.roles.includes(AuthRole.ADMIN)) data = await this.remittancesService.findOne({ where: { id } });
    else
      data = await this.remittancesService.findOne({
        where: [
          { id, sender: { id: currentUser.id } },
          { id, receiver: { id: currentUser.id } },
        ],
      });
    return { data };
  }

  @ApiGet({
    path: API_ENDPOINTS.REMITTANCES.MOVEMENTS,
    roles: ALL_ROLES,
    summary: 'Get `RemittanceMovements` by `Remittance` Id',
    description:
      'Retrieves a log of every action performed to the matched `Remittance`. If you are not an Admin user, the `Remittance` must be related to the current logged in user',
    responseDescription:
      'A list of models containing the information of the related `RemittanceMovements` in the database.',
    responseType: [RemittanceMovement],
  })
  @ApiParam({ name: 'id', type: Number })
  async movementsById(
    @Param('id', ParseIntPipe) id: number,
    @CurrentAuth() currentUser: User,
  ): Promise<IHttpResponse<Remittance>> {
    const data = await this.remittancesService.findOne({
      relations: ['movements'],
      where: [
        { id, sender: { id: currentUser.id } },
        { id, receiver: { id: currentUser.id } },
      ],
    });
    return { data };
  }

  @ApiPatch({
    path: API_ENDPOINTS.REMITTANCES.CANCEL,
    roles: ALL_ROLES,
    summary: 'Cancels a pending `Remittance` by Id',
    description:
      'Updates a `Remittance` record that matches the Id. If you are not an Admin user, the sender of the `Remittance` must be the current logged in user',
    responseDescription: 'A model containing the updated information of the matched `Remittance`',
    responseType: Remittance,
  })
  @ApiParam({ name: 'id', type: Number })
  async cancel(
    @Param('id', ParseIntPipe) id: number,
    @CurrentAuth() currentUser: User,
  ): Promise<IHttpResponse<RemittanceMovement>> {
    const data = await this.remittancesService.updateById(id, {
      updatedBy: currentUser,
      updatedStatus: RemittanceStatus.CANCELED,
    });
    return { data };
  }

  @ApiPatch({
    path: API_ENDPOINTS.REMITTANCES.REJECT,
    roles: [AuthRole.REGULAR],
    summary: 'Rejects a pending `Remittance` by Id',
    description:
      'Updates a `Remittance` record that matches the Id. The receiver of the `Remittance` must be the current logged in user',
    responseDescription: 'A model containing the updated information of the matched `Remittance`',
    responseType: Remittance,
  })
  @ApiParam({ name: 'id', type: Number })
  async reject(
    @Param('id', ParseIntPipe) id: number,
    @CurrentAuth() currentUser: User,
  ): Promise<IHttpResponse<RemittanceMovement>> {
    const data = await this.remittancesService.updateById(id, {
      updatedBy: currentUser,
      updatedStatus: RemittanceStatus.REJECTED,
    });
    return { data };
  }

  @ApiPatch({
    path: API_ENDPOINTS.REMITTANCES.WITHDRAW,
    roles: [AuthRole.REGULAR],
    summary: 'Withdraw a pending `Remittance` by Id',
    description:
      'Updates a `Remittance` record that matches the Id. The receiver of the `Remittance` must be the current logged in user',
    responseDescription: 'A model containing the updated information of the matched `Remittance`',
    responseType: Remittance,
  })
  @ApiParam({ name: 'id', type: Number })
  async withdraw(
    @Param('id', ParseIntPipe) id: number,
    @CurrentAuth() currentUser: User,
  ): Promise<IHttpResponse<RemittanceMovement>> {
    const data = await this.remittancesService.updateById(id, {
      updatedBy: currentUser,
      updatedStatus: RemittanceStatus.WITHDRAWN,
    });
    return { data };
  }
}
