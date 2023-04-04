import { Module } from '@nestjs/common'

import { LogService } from './log.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Log } from '@/Entities'

@Module({
  imports: [TypeOrmModule.forFeature([Log])],
  providers: [LogService],
  exports: [LogService],
})
export class LogModule {}
