import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Length,
  Matches,
} from 'class-validator';

export class CreateUserDTO {
  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 30)
  @Matches(RegExp(/^[A-Za-z0-9-_]+$/))
  readonly username: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 64)
  @IsStrongPassword()
  readonly password: string;
}
