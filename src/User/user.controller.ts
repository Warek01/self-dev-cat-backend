import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Req,
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
    return await this._userService.findOneByEmail(req.user.email)
  }
}
