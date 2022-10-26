import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { RemittanceStatus, REMITTANCE_STATUS_VALUES } from '@remittances/constants';
import { User } from '@users/entities';
import { RemittanceMovement } from './remittance-movement.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Currency } from '@exchange-rates/constants';

@Entity()
export class Remittance {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ type: () => User })
  @ManyToOne(() => User, (sender) => sender.sentRemittances, { eager: true })
  sender: User;

  @ApiProperty({ type: () => User })
  @ManyToOne(() => User, (receiver) => receiver.receivedRemittances, { eager: true })
  receiver: User;

  @ApiProperty()
  @Column({ type: 'double' })
  originAmount: number;

  @ApiProperty({ enum: [Currency.USD, Currency.EUR] })
  @Column({
    type: 'enum',
    enum: [Currency.USD, Currency.EUR],
    default: Currency.USD,
  })
  originCurrency: Currency;

  @ApiProperty()
  @Column({ type: 'double' })
  destinationAmount: number;

  @ApiProperty({ enum: [Currency.MXN] })
  @Column({
    type: 'enum',
    enum: [Currency.MXN],
    default: Currency.MXN,
  })
  destinationCurrency: Currency;

  @ApiProperty({ enum: REMITTANCE_STATUS_VALUES })
  @Column({
    type: 'enum',
    enum: REMITTANCE_STATUS_VALUES,
    default: RemittanceStatus.SENT,
  })
  status: RemittanceStatus;

  @ApiProperty({ type: () => RemittanceMovement, isArray: true })
  @OneToMany(() => RemittanceMovement, (movement) => movement.remittance)
  movements: RemittanceMovement[];
}
