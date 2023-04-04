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
      usernameField: 'email',
      passReqToCallback: false,
    })
  }

  async validate(
    email: string,
    password: string,
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this._authService.validateUser(email, password)

    if (!user) {
      throw new UnauthorizedException()
    }

    return user
  }
}
