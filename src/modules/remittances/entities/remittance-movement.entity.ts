import { ApiProperty } from '@nestjs/swagger';
import { ALL_REMITTANCE_STATUS_EXCEPT, RemittanceStatus, REMITTANCE_STATUS_VALUES } from '@remittances/constants';
import { User } from '@users/entities';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Remittance } from './remittance.entity';

@Entity()
export class RemittanceMovement {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ type: () => Remittance })
  @ManyToOne(() => Remittance, (remittance) => remittance.movements)
  remittance: Remittance;

  @ApiProperty({ type: () => User })
  @ManyToOne(() => User, (user) => user.movements, { eager: true })
  updatedBy: User;

  @ApiProperty({ enum: RemittanceStatus })
  @Column({
    type: 'enum',
    enum: REMITTANCE_STATUS_VALUES,
  })
  previousStatus: RemittanceStatus;

  @ApiProperty({ enum: ALL_REMITTANCE_STATUS_EXCEPT(RemittanceStatus.SENT) })
  @Column({
    type: 'enum',
    enum: ALL_REMITTANCE_STATUS_EXCEPT(RemittanceStatus.SENT),
  })
  updatedStatus: RemittanceStatus;

  @ApiProperty({ type: Date })
  @CreateDateColumn()
  updatedAt: Date;
}
