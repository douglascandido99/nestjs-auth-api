import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@prisma/client';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRepository } from 'src/user/repository/user.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly user: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: {
    id: number;
    email: string;
    username: string;
  }): Promise<User> {
    try {
      const user = await this.user.findUserById(payload.id);

      if (user) {
        delete user.hash;

        return user;
      } else {
        return null;
      }
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while validating the JWT token.',
      );
    }
  }
}
