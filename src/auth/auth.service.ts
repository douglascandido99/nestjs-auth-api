import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from 'src/user/repository/user.repository';
import { AuthRepository } from './repository/auth.repository';
import { LoginUserDTO } from './dto/login-user.dto';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private readonly user: UserRepository,
    private readonly auth: AuthRepository,
  ) {}

  async login(dto: LoginUserDTO) {
    const { email, username, password } = dto;

    const [emailLogin, usernameLogin] = await Promise.all([
      this.user.findUserByEmail(email),
      this.user.findUserByUsername(username),
    ]);

    if (!emailLogin && !usernameLogin)
      throw new NotFoundException('User not found.');

    const user = emailLogin || usernameLogin;

    const passwordMatches = await this.validatePassword(user.hash, password);

    if (!passwordMatches) throw new UnauthorizedException('Invalid password.');

    const accessTokenPayload = {
      id: user.id,
      u: user.username,
      e: user.email,
    };

    return {
      accessToken: await this.auth.createAccessToken(accessTokenPayload),
    };
  }

  private async validatePassword(hash: string, password: string) {
    return await argon.verify(hash, password);
  }
}
