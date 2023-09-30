import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/common/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(data: Prisma.UserCreateInput) {
    return await this.prisma.user.create({
      data,
    });
  }

  async getAllUsers() {
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

  async updateUser(id: number, data: Prisma.UserUpdateInput) {
    return await this.prisma.user.update({
      where: {
        id,
      },
      data,
    });
  }

  async deleteUser(id: number) {
    return await this.prisma.user.delete({
      where: {
        id,
      },
    });
  }

  async findUserById(id: number) {
    return await this.prisma.user.findFirst({
      where: {
        id,
      },
    });
  }

  async findUserByEmail(email: string) {
    return await this.prisma.user.findFirst({
      where: {
        email,
      },
    });
  }

  async findUserByUsername(username: string) {
    return await this.prisma.user.findFirst({
      where: {
        username,
      },
    });
  }
}
