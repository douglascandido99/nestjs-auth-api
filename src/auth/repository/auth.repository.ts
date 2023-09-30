import { BadRequestException, Injectable } from '@nestjs/common';
import * as argon from 'argon2';

@Injectable()
export class AuthRepository {
  async validatePassword(hash: string, password: string): Promise<boolean> {
    return await argon.verify(hash, password);
  }

  async hashPassword(password: string): Promise<string> {
    return await argon.hash(password);
  }

  async comparePassword(
    newPassword: string,
    newPasswordCheck: string,
  ): Promise<void> {
    if (newPassword !== newPasswordCheck)
      throw new BadRequestException('Password must match.');
  }
}
