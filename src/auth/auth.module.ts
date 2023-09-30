import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { UserModule } from 'src/user/user.module';
import { UserRepository } from 'src/user/repository/user.repository';
import { PrismaService } from 'src/common/prisma.service';
import { JwtRepository } from './repository/jwt.repository';
import { AuthRepository } from './repository/auth.repository';

@Module({
  imports: [JwtModule, UserModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtRepository,
    AuthRepository,
    UserRepository,
    PrismaService,
    JwtStrategy,
  ],
  exports: [AuthService, AuthRepository, JwtRepository],
})
export class AuthModule {}
