import { Authentication } from '@authentication/entities/authentication.entity';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import to from 'await-to-js';

import { AuthenticationSignUpDto } from '@authentication/dto';
import { AuthRole, AuthTokenResponse, AUTH_ROLE_VALUES, IDecodedToken } from '@authentication/constants';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@authentication/entities';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(Authentication)
    private readonly authRepository: Repository<Authentication>,
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
    private readonly jwtService: JwtService,
  ) {}

  async validateByCredentials(identifier: string, plainTextPassword: string): Promise<Authentication> {
    const authentication = await this.authRepository.findOneBy({ identifier });
    if (!authentication) throw new NotFoundException('Registry does not exist');
    const matches = await bcrypt.compare(plainTextPassword, authentication.passwordHash);
    if (!matches) throw new UnauthorizedException('Wrong credentials provided');
    return authentication;
  }

  async validateByToken(payload: IDecodedToken): Promise<Authentication> {
    const authentication = await this.authRepository.findOneBy({ id: payload.authId });
    if (!authentication) throw new NotFoundException('Authentication registry not longer exists');
    return authentication;
  }

  async logIn(authentication: Authentication): Promise<AuthTokenResponse> {
    return {
      authentication,
      authToken: this.jwtService.sign({
        authId: authentication.id,
        identifier: authentication.identifier,
      } as IDecodedToken),
    };
  }

  async signUp(dto: AuthenticationSignUpDto, roles?: AuthRole[]): Promise<AuthTokenResponse> {
    const hashedPassword = await bcrypt.hash(dto.plainTextPassword, 10);
    const validatedRoles = await this.validateAuthRoles(roles ?? [AuthRole.REGULAR]);
    const authentication = this.authRepository.create({
      identifier: dto.identifier,
      passwordHash: hashedPassword,
      roles: validatedRoles,
    });
    const [err] = await to(this.authRepository.save(authentication));
    if (err) throw new ConflictException('A registry with this identifier already exists', err.message);
    return {
      authentication,
      authToken: this.jwtService.sign({
        authId: authentication.id,
        identifier: dto.identifier,
      } as IDecodedToken),
    };
  }

  async syncAuthRoles(): Promise<void> {
    const [err] = await to(this.validateAuthRoles(AUTH_ROLE_VALUES, true));
    if (err) throw new InternalServerErrorException('Could not sync roles into the database', err.message);
    console.info('Authentication roles synced successfully');
  }

  private async validateAuthRoles(roles: string[], generate = false): Promise<Role[]> {
    const data = await Promise.all(
      roles.map(async (roleName) => {
        const role = await this.rolesRepository.findOneBy({ name: roleName });
        if (!role) {
          if (generate) await this.rolesRepository.insert({ name: roleName });
          else throw new BadRequestException('Invalid Authentication Role');
        }
        return role;
      }),
    );
    return data;
  }
}
