import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import to from 'await-to-js';

import { AuthenticationService } from '@authentication/services';
import { UserAuthTokenDto, UserSignUpDto } from '@users/dto';
import { User } from '@users/entities';
import { AuthRole } from '@authentication/constants';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly authService: AuthenticationService,
  ) {}

  async signUp(dto: UserSignUpDto, isAdmin = false): Promise<UserAuthTokenDto> {
    const { authentication, authToken } = await this.authService.signUp(
      {
        identifier: dto.email,
        plainTextPassword: dto.password,
      },
      isAdmin ? [AuthRole.ADMIN] : null,
    );
    const user = this.usersRepository.create({
      email: dto.email,
      firstName: dto.firstName,
      lastName: dto.lastName,
      authentication,
    });
    const [err] = await to(this.usersRepository.save(user));
    if (err) throw new ForbiddenException(err.name, err.message);
    delete user.authentication;
    return { user, authToken };
  }

  async logIn(email: string): Promise<UserAuthTokenDto> {
    const user = await this.usersRepository.findOne({
      relations: ['authentication'],
      where: { email },
    });
    if (!user) throw new NotFoundException('User not found');
    const { authToken } = await this.authService.logIn(user.authentication);
    delete user.authentication;
    return { user, authToken };
  }

  async testAdmin() {
    const exists = await this.usersRepository.findOneBy({ email: 'admin@admin.com' });
    if (!exists) {
      await this.signUp(
        {
          email: 'admin@admin.com',
          firstName: 'Bruce',
          lastName: 'Wayne',
          password: 'Abc1234#',
          confirmPassword: 'Abc1234#',
        },
        true,
      );
    }
  }
}
