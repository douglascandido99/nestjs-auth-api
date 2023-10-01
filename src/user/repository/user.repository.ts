import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/common/prisma.service';
import { CleanUser } from './protocols/clean-user.protocol';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return await this.prisma.user.create({
      data,
    });
  }

  async getAllUsers(): Promise<CleanUser[]> {
    return await this.prisma.user.findMany({
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        name: true,
        email: true,
        username: true,
      },
    });
  }

  async updateUser(
    id: number,
    data: Prisma.UserUpdateInput,
  ): Promise<User | null> {
    const user = await this.prisma.user.update({
      where: {
        id,
      },
      data,
    });

    return user || null;
  }

  async deleteUser(id: number): Promise<User> {
    return await this.prisma.user.delete({
      where: {
        id,
      },
    });
  }

  async findUserById(id: number): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        id,
      },
    });

    return user || null;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });

    return user || null;
  }

  async findUserByUsername(username: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        username,
      },
    });

    return user || null;
  }
}
