import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { User } from '@prisma/client';
import { UpdateUserDTO } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UpdatePasswordDTO } from './dto/update-password.dto';
import { CleanUser } from './repository/protocols/clean-user.protocol';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async signUp(@Body() dto: CreateUserDTO): Promise<User> {
    return await this.userService.signUp(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@GetUser() user: User): Promise<User> {
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getUserById(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return await this.userService.getUserById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllUsers(): Promise<CleanUser[]> {
    return await this.userService.getAllUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async updateUser(
    @GetUser('id') id: number,
    @Body() dto: UpdateUserDTO,
  ): Promise<User | null> {
    return await this.userService.updateUserInfo(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('change-password')
  async updatePassword(
    @GetUser('id') id: number,
    @Body() dto: UpdatePasswordDTO,
  ): Promise<{ msg: string }> {
    return await this.userService.updatePassword(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('me')
  async deleteUser(@GetUser('id') id: number): Promise<{ msg: string }> {
    return await this.userService.deleteUser(id);
  }
}
