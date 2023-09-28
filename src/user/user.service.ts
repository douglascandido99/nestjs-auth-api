import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserRepository } from './repository/user.repository';
import { CreateUserDTO } from './dto/create-user.dto';
import * as argon from 'argon2';

@Injectable()
export class UserService {
  constructor(private readonly user: UserRepository) {}

  async signUp(dto: CreateUserDTO) {
    const { name, username, email, password } = dto;
    const [existentEmail, existentUsername] = await Promise.all([
      this.user.findUserByEmail(email),
      this.user.findUserByUsername(username),
    ]);

    if (existentEmail)
      throw new ConflictException('This e-mail is already in use.');
    if (existentUsername)
      throw new ConflictException('This username is already in use.');

    try {
      const hash = await this.hashPasword(password);

      const user = await this.user.createUser({ name, email, username, hash });

      const createdUser = { ...user };
      delete createdUser.hash;
      return createdUser;
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong.');
    }
  }

  private async hashPasword(password: string) {
    return await argon.hash(password);
  }
}
