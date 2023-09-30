import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './repository/user.repository';
import { PrismaService } from 'src/common/prisma.service';
import { AuthRepository } from 'src/auth/repository/auth.repository';

@Module({
  controllers: [UserController],
  providers: [UserService, UserRepository, PrismaService, AuthRepository],
  exports: [UserService, UserRepository],
})
export class UserModule {}
