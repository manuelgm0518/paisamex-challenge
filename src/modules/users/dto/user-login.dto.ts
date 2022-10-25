import { PickType } from '@nestjs/swagger';
import { UserSignUpDto } from './user-signup.dto';

export class UserLogInDto extends PickType(UserSignUpDto, ['email', 'password']) {}
