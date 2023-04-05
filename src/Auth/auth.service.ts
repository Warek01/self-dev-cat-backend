import { Injectable, UnauthorizedException } from '@nestjs/common'

import UserService from '@/User/user.service'
import { User } from '@/Entities'
import { EncryptionService } from '@/Encryption/encryption.service'

@Injectable()
export class AuthService {
  constructor(
    private _userService: UserService,
    private _encryptionService: EncryptionService,
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
}
