import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';
import { Column, OneToOne, JoinColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { Authentication } from '@authentication/entities';

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

  @OneToOne(() => Authentication)
  @JoinColumn()
  authentication?: Authentication;

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
