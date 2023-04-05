import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  NotImplementedException,
  Patch,
  Post,
  Req,
  NotFoundException,
  UseGuards,
} from '@nestjs/common'
import { object, string, ValidationError } from 'yup'

import UserService from '@/User/user.service'
import { User } from '@/Entities'
import { UserCreateData } from '@/User/user.types'
import { AuthService } from '@/Auth/auth.service'
import { BasicAuthGuard } from '@/Auth/Guard/basic-auth.guard'
import RequestWithUser from '@/Types/RequestWithUser'

@Controller('user')
export class UserController {
  private static _userCreateSchema = object({
    email: string().required().email(),
    username: string().required().min(1).max(255),
    password: string().required().min(5).max(255),
  })

  constructor(private _userService: UserService, private _authService: AuthService) {}

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  async postUser(@Body() createData: UserCreateData): Promise<User> {
    try {
      const userData = await UserController._userCreateSchema.validate(createData)
      return await this._userService.create(createData)
    } catch (err) {
      if (err instanceof ValidationError) {
        throw new HttpException(err.message, HttpStatus.NOT_ACCEPTABLE)
      }

      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Get()
  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.OK)
  public async getUserData(@Req() req: RequestWithUser): Promise<User | null> {
    try {
      return await this._userService.findOneByEmail(req.user.email)
    } catch {
      throw new NotFoundException()
    }
  }

  @Delete()
  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Req() req: RequestWithUser): Promise<void> {
    await this._userService.delete(req.user.email)
  }

  @Patch('password')
  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async changePassword(
    @Req() req: RequestWithUser,
    @Body() body: { password: string },
  ): Promise<void> {
    try {
      await this._userService.changePassword(req.user.email, body.password)
    } catch {
      throw new HttpException('Not modified', HttpStatus.NOT_MODIFIED)
    }
  }

  @Patch('real-name')
  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async changeRealName(
    @Req() req: RequestWithUser,
    @Body() body: { name: string },
  ): Promise<void> {
    try {
      await this._userService.changeRealName(req.user.email, body.name)
    } catch {
      throw new HttpException('Not modified', HttpStatus.NOT_MODIFIED)
    }
  }

  @Patch('username')
  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async changeUsername(
    @Req() req: RequestWithUser,
    @Body() body: { username: string },
  ): Promise<void> {
    try {
      await this._userService.changeUsername(req.user.email, body.username)
    } catch {
      throw new HttpException('Not modified', HttpStatus.NOT_MODIFIED)
    }
  }

  @Patch('add-friend')
  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async addFriend(
    @Req() req: RequestWithUser,
    @Body() body: { to: string },
  ): Promise<void> {
    await this._userService.addFriend(req.user.username, body.to)
  }

  @Patch('remove-friend')
  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeFriend(): Promise<void> {
    throw new NotImplementedException()
  }
}
