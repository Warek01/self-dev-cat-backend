import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Log } from '@/Entities'
import { Repository } from 'typeorm'

@Injectable()
export class LogService {
  constructor(@InjectRepository(Log) private _logRepo: Repository<Log>) {}

  public async logNewUser(
    username: string,
    email: string,
    date: Date = new Date(),
  ): Promise<void> {
    const log = await this._logRepo.create()

    log.date = new Date()

    log.type = 'create_user'
    log.date = new Date()
    log.description = `Created user ${username}. With email ${email}`

    await this._logRepo.save(log)
  }
}
