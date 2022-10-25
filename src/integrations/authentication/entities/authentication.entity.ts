import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from './auth-roles.entity';

@Entity()
export class Authentication {
  @Exclude()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Access unique identifier required to access. Could be an email, username, etc.' })
  @Exclude()
  @Column({ unique: true })
  identifier: string;

  @ApiProperty({ description: 'Hashed access key' })
  @Exclude()
  @Column()
  passwordHash: string;

  @ApiProperty()
  @ManyToMany(() => Role, { eager: true })
  @JoinTable()
  roles: Role[];
}
