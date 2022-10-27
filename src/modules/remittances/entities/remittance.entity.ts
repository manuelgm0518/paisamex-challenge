import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { RemittanceStatus, REMITTANCE_STATUS_VALUES } from '@remittances/constants';
import { User } from '@users/entities';
import { RemittanceMovement } from './remittance-movement.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Currency } from '@exchange-rates/constants';
import { IsEnum, IsNumber, IsPositive, Max } from 'class-validator';

@Entity()
export class Remittance {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ type: () => User, description: 'The User who sends the remittance' })
  @ManyToOne(() => User, (sender) => sender.sentRemittances, { eager: true })
  sender: User;

  @ApiProperty({ type: () => User, description: 'The User who will receive the remittance' })
  @ManyToOne(() => User, (receiver) => receiver.receivedRemittances, { eager: true })
  receiver: User;

  @ApiProperty({ description: 'How much money will be sent' })
  @IsNumber()
  @IsPositive()
  @Max(5000)
  @Column({ type: 'double' })
  originAmount: number;

  @ApiProperty({ enum: [Currency.USD, Currency.EUR], description: 'The origin currency of the remittance' })
  @IsEnum([Currency.USD, Currency.EUR])
  @Column({
    type: 'enum',
    enum: [Currency.USD, Currency.EUR],
    default: Currency.USD,
  })
  originCurrency: Currency;

  @ApiProperty({ description: 'The result of converting originAmount into the destinationCurrency' })
  @IsNumber()
  @IsPositive()
  @Column({ type: 'double' })
  destinationAmount: number;

  @ApiProperty({ enum: [Currency.MXN], description: 'The currency of the destination' })
  @IsEnum([Currency.MXN])
  @Column({
    type: 'enum',
    enum: [Currency.MXN],
    default: Currency.MXN,
  })
  destinationCurrency: Currency;

  @ApiProperty({ enum: REMITTANCE_STATUS_VALUES, description: 'The current status of the remittance sending process' })
  @Column({
    type: 'enum',
    enum: REMITTANCE_STATUS_VALUES,
    default: RemittanceStatus.SENT,
  })
  status: RemittanceStatus;

  @ApiProperty({
    type: () => RemittanceMovement,
    isArray: true,
    description: 'A log containing every updated related to the status of the remittance',
  })
  @OneToMany(() => RemittanceMovement, (movement) => movement.remittance)
  movements: RemittanceMovement[];
}
