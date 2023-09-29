import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { AuthRepository } from './repository/auth.repository';
import { UserModule } from 'src/user/user.module';
import { UserRepository } from 'src/user/repository/user.repository';
import { PrismaService } from 'src/common/prisma.service';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule,
    UserModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthRepository,
    UserRepository,
    PrismaService,
    JwtStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
