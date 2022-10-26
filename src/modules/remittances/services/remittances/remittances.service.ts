import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import to from 'await-to-js';

import { RemittanceSendDto, RemittanceUpdateDto } from '@remittances/dto';
import { Remittance, RemittanceMovement } from '@remittances/entities';
import { User } from '@users/entities';
import { AuthRole } from '@authentication/constants';
import { RemittanceStatus } from '@remittances/constants';
import { UsersService } from '@users/services';
import { ExchangeRatesService } from '@exchange-rates/services';

@Injectable()
export class RemittancesService {
  constructor(
    @InjectRepository(Remittance)
    private readonly remittancesRepository: Repository<Remittance>,
    @InjectRepository(RemittanceMovement)
    private readonly movementsRepository: Repository<RemittanceMovement>,
    private readonly usersService: UsersService,
    private readonly exchangeRatesService: ExchangeRatesService,
  ) {}

  async create(sender: User, dto: RemittanceSendDto): Promise<Remittance> {
    if (sender.id === dto.receiver) throw new BadRequestException('The Receiver can not be the same as the Sender');
    const receiver = await this.usersService.findOne({ where: { id: dto.receiver } });
    if (!receiver) throw new NotFoundException('The Receiver user does not exist');
    const destinationAmount = await this.exchangeRatesService.convert(
      dto.originAmount,
      dto.originCurrency,
      dto.destinationCurrency,
    );
    const remittance = this.remittancesRepository.create({ ...dto, sender, receiver, destinationAmount });
    const [err] = await to(this.remittancesRepository.save(remittance));
    if (err) throw new ForbiddenException(err.name, err.message);
    return remittance;
  }

  async find(options?: FindManyOptions<Remittance>): Promise<Remittance[]> {
    const remittances = this.remittancesRepository.find(options);
    return remittances;
  }

  async findOne(options: FindOneOptions<Remittance>): Promise<Remittance> {
    const remittance = await this.remittancesRepository.findOne(options);
    if (!remittance) throw new NotFoundException('Remittance not found');
    return remittance;
  }

  async updateById(id: number, dto: RemittanceUpdateDto): Promise<RemittanceMovement> {
    const remittance = await this.validateRemittance(id, dto.updatedStatus);
    switch (dto.updatedStatus) {
      case RemittanceStatus.CANCELED: {
        if (!dto.updatedBy.roles.includes(AuthRole.ADMIN) && remittance.sender.id !== dto.updatedBy.id)
          throw new ForbiddenException('A remittance can only be canceled by the User who sent it or an Admin');
        break;
      }
      case RemittanceStatus.REJECTED:
      case RemittanceStatus.WITHDRAWN: {
        if (remittance.receiver.id !== dto.updatedBy.id)
          throw new ForbiddenException('A remittance can only be rejected and withdrawn by the user who receives it');
        break;
      }
    }
    const movement = await this.logRemittanceMovement(remittance, dto);
    await this.remittancesRepository.update({ id: remittance.id }, { status: dto.updatedStatus });
    return movement;
  }

  private async validateRemittance(id: number, updatedStatus: RemittanceStatus): Promise<Remittance> {
    const remittance = await this.remittancesRepository.findOneBy({ id });
    if (!remittance) throw new NotFoundException('Remittance not found');
    if (remittance.status === updatedStatus)
      throw new ConflictException(`The status of the remittance already is ${remittance.status}`);
    if (remittance.status !== RemittanceStatus.SENT)
      throw new ConflictException('This remittance can not be updated anymore');
    return remittance;
  }

  private async logRemittanceMovement(remittance: Remittance, dto: RemittanceUpdateDto) {
    const movement = this.movementsRepository.create({
      remittance,
      updatedBy: dto.updatedBy,
      previousStatus: remittance.status,
      updatedStatus: dto.updatedStatus,
    });
    const [err] = await to(this.movementsRepository.save(movement));
    if (err) throw new ForbiddenException(err.name, err.message);
    return movement;
  }
}
