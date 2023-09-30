import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtRepository {
  constructor(private readonly jwt: JwtService) {}

  async createAccessToken(payload: {
    id: number;
    u: string;
    e: string;
  }): Promise<string> {
    return await this.jwt.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES,
    });
  }
}
