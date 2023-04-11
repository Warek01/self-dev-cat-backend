import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import type { JwtResponse } from '@/Types/Jwt'
import { UserService } from '@/User/user.service'
import { User } from '@/Entities'
import { EncryptionService } from '@/Encryption/encryption.service'
import { LogService } from '@/Log/log.service'

@Injectable()
export class AuthService {
  constructor(
    private _userService: UserService,
    private _encryptionService: EncryptionService,
    private _jwtService: JwtService,
    private _logService: LogService,
  ) {}

  public async validateUser(
    username: string,
    password: string,
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this._userService.findOneByUsername(username)

    if (user && (await this._encryptionService.compare(password, user.password))) {
      const { password, ...result } = user
      return result
    }

    return null
  }

  login(user: Omit<User, 'password'>): JwtResponse {
    const payload = { username: user.username, sub: user.id }
    this._logService.auth.login(user as User)

    return {
      access_token: this._jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN,
      }),
    }
  }
}
