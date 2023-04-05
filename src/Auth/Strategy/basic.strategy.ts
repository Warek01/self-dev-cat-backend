import { BasicStrategy as BasicPassportStrategy } from 'passport-http'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'

import { AuthService } from '@/Auth/auth.service'
import { User } from '@/Entities'

@Injectable()
export class BasicStrategy extends PassportStrategy(BasicPassportStrategy) {
  constructor(private _authService: AuthService) {
    super({
      session: false,
      passwordField: 'password',
      usernameField: 'username',
      passReqToCallback: false,
    })
  }

  async validate(
    username: string,
    password: string,
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this._authService.validateUser(username, password)

    if (!user) {
      throw new UnauthorizedException()
    }

    return user
  }
}
