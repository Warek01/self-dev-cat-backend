import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'

import type { UserCreateData } from './user.types'
import { Log, User } from '@/Entities'
import { EncryptionService } from '@/Encryption/encryption.service'
import { LogService } from '@/Log/log.service'

@Injectable()
export default class UserService {
  constructor(
    @InjectRepository(User) private _userRepo: Repository<User>,
    private _dataSource: DataSource,
    private _encryptionService: EncryptionService,
    private _logService: LogService,
  ) {}

  public async create(data: UserCreateData): Promise<User> {
    const user = await this._userRepo.create()
    await this._dataSource.transaction(async (manager) => {
      user.email = data.email
      user.password = await this._encryptionService.encrypt(data.password)
      user.username = data.username
      user.createdAt = user.updatedAt = new Date()

      await this._logService.logNewUser(
        user.username,
        user.email,
        user.createdAt,
      )

      await manager.save(user)
    })

    return user
  }

  public async findOneByEmail(email: string): Promise<User | null> {
    return await this._userRepo.findOne({
      where: {
        email,
      },
    })
  }
}
