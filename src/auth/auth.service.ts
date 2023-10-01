import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from 'src/user/repository/user.repository';
import { LoginUserDTO } from './dto/login-user.dto';
import { AuthRepository } from './repository/auth.repository';
import { JwtRepository } from './repository/jwt.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly user: UserRepository,
    private readonly auth: AuthRepository,
    private readonly jwt: JwtRepository,
  ) {}

  async login(dto: LoginUserDTO): Promise<{ accessToken: string }> {
    const { email, username, password } = dto;

    const [emailLogin, usernameLogin] = await Promise.all([
      this.user.findUserByEmail(email),
      this.user.findUserByUsername(username),
    ]);

    if (!emailLogin && !usernameLogin)
      throw new NotFoundException('User not found.');

    const user = emailLogin || usernameLogin;

    const passwordMatches = await this.auth.validatePassword(
      user.hash,
      password,
    );

    if (!passwordMatches)
      throw new UnauthorizedException('Incorrect password.');

    try {
      const accessTokenPayload = {
        id: user.id,
        u: user.username,
        e: user.email,
      };

      return {
        accessToken: await this.jwt.createAccessToken(accessTokenPayload),
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to login user.');
    }
  }
}
