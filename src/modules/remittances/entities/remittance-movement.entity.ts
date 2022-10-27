import { ApiProperty } from '@nestjs/swagger';
import { ALL_REMITTANCE_STATUS_EXCEPT, RemittanceStatus, REMITTANCE_STATUS_VALUES } from '@remittances/constants';
import { User } from '@users/entities';
import { IsEnum } from 'class-validator';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Remittance } from './remittance.entity';

@Entity()
export class RemittanceMovement {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ type: () => Remittance, description: 'The remittance to which this movement belongs' })
  @ManyToOne(() => Remittance, (remittance) => remittance.movements)
  remittance: Remittance;

  @ApiProperty({ type: () => User, description: 'The user who made this movement' })
  @ManyToOne(() => User, (user) => user.movements, { eager: true })
  updatedBy: User;

  @ApiProperty({ enum: RemittanceStatus, description: 'The status of the remittance before this movement' })
  @IsEnum(RemittanceStatus)
  @Column({ type: 'enum', enum: REMITTANCE_STATUS_VALUES })
  previousStatus: RemittanceStatus;

  @ApiProperty({
    enum: ALL_REMITTANCE_STATUS_EXCEPT(RemittanceStatus.SENT),
    description: 'The new status of the remittance after this movement',
  })
  @IsEnum(ALL_REMITTANCE_STATUS_EXCEPT(RemittanceStatus.SENT))
  @Column({ type: 'enum', enum: ALL_REMITTANCE_STATUS_EXCEPT(RemittanceStatus.SENT) })
  updatedStatus: RemittanceStatus;

  @ApiProperty({ type: Date, description: 'The date and time when this movement was done' })
  @CreateDateColumn()
  updatedAt: Date;
}
