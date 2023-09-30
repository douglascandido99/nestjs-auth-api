import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from './repository/user.repository';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { AuthRepository } from 'src/auth/repository/auth.repository';
import { UpdatePasswordDTO } from './dto/update-password.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly user: UserRepository,
    private readonly auth: AuthRepository,
  ) {}

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
      const hash = await this.auth.hashPassword(password);

      const user = await this.user.createUser({ name, email, username, hash });

      const createdUser = { ...user };

      delete createdUser.hash;

      return createdUser;
    } catch (error) {
      throw new InternalServerErrorException('Failed to create user.');
    }
  }

  async getUserById(id: number) {
    const user = await this.user.findUserById(id);

    if (!user) throw new NotFoundException('User not found.');

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

  async updatePassword(id: number, dto: UpdatePasswordDTO) {
    const user = await this.user.findUserById(id);

    if (!user) throw new NotFoundException('User not found.');

    await this.auth.comparePassword(dto.newPassword, dto.newPasswordCheck);

    if (!(await this.auth.validatePassword(user.hash, dto.oldPassword)))
      throw new UnauthorizedException('Incorrect password.');

    if (dto.oldPassword === dto.newPassword)
      throw new BadRequestException(
        'The new password cannot be the same as your current password.',
      );

    try {
      const hash = await this.auth.hashPassword(dto.newPassword);

      await this.user.updateUser(id, { hash: hash });
      return { msg: 'Password updated.' };
    } catch (error) {
      throw new InternalServerErrorException('Failed to update password.');
    }
  }

  async deleteUser(id: number) {
    const userId = await this.user.findUserById(id);

    if (!userId) throw new NotFoundException('User not found.');

    await this.user.deleteUser(id);

    return { msg: 'User deleted.' };
  }
}
