import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './repository/user.repository';
import { CreateUserDTO } from './dto/create-user.dto';
import * as argon from 'argon2';
import { UpdateUserDTO } from './dto/update-user.dto';

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

  async getUserById(id: number) {
    const user = await this.user.findUserById(id);

    if (!user) throw new NotFoundException('User not found');

    delete user.hash;

    return user;
  }

  async getAllUsers() {
    return await this.user.getAllUsers();
  }

  async updateUserInfo(id: number, dto: UpdateUserDTO) {
    const userId = await this.user.findUserById(id);

    if (!userId) throw new NotFoundException('User not found.');

    const user = await this.user.updateUser(id, dto);

    const updatedUser = { ...user };

    delete updatedUser.hash;

    return updatedUser;
  }

  async deleteUser(id: number) {
    const userId = await this.user.findUserById(id);

    if (!userId) throw new NotFoundException('User not found');

    await this.user.deleteUser(id);

    return { msg: 'User deleted.' };
  }

  private async hashPasword(password: string) {
    return await argon.hash(password);
  }
}
