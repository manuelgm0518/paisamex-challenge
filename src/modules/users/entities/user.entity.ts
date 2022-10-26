import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';
import { Column, OneToOne, JoinColumn, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

import { Authentication } from '@authentication/entities';
import { Remittance, RemittanceMovement } from '@remittances/entities';
import { AuthRole } from '@authentication/constants';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @ApiProperty({ description: 'User unique identifier' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: "User's email address" })
  @IsEmail()
  @Column()
  email: string;

  @ApiProperty({ description: "User's first name" })
  @IsString()
  @Column()
  firstName: string;

  @ApiProperty({ description: "User's last name" })
  @IsString()
  @Column()
  lastName: string;

  @ApiPropertyOptional({ type: () => Authentication })
  @Exclude()
  @OneToOne(() => Authentication, { eager: true })
  @JoinColumn()
  authentication?: Authentication;

  @ApiProperty({ type: () => Remittance, isArray: true })
  @OneToMany(() => Remittance, (remittance) => remittance.sender)
  sentRemittances: Remittance[];

  @ApiProperty({ type: () => Remittance, isArray: true })
  @OneToMany(() => Remittance, (remittance) => remittance.receiver)
  receivedRemittances: Remittance[];

  @ApiProperty({ type: () => RemittanceMovement, isArray: true })
  @OneToMany(() => RemittanceMovement, (movement) => movement.updatedBy)
  movements: RemittanceMovement[];

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  get roles(): AuthRole[] {
    return this.authentication?.roles?.map((e) => e.authRole) ?? [];
  }
}
