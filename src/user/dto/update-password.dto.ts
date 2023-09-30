import {
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Length,
} from 'class-validator';

export class UpdatePasswordDTO {
  @IsNotEmpty()
  @IsString()
  readonly oldPassword: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 64)
  @IsStrongPassword()
  readonly newPassword: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 64)
  @IsStrongPassword()
  readonly newPasswordCheck: string;
}
