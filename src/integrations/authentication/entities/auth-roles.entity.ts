import { AuthRole, AUTH_ROLE_VALUES } from '@authentication/constants';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Role {
  @ApiProperty({ description: "Role's primary key" })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty({ description: "Role's identifier name" })
  @IsString()
  @Length(1, 32)
  @Index({ unique: true })
  @Column({ length: 32 })
  name: string;

  get authRole(): AuthRole {
    return AUTH_ROLE_VALUES.find((e) => e == this.name);
  }
}
