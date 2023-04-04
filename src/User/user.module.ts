import { Module } from '@nestjs/common'

import UserService from './user.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Log, User } from '@/Entities'
import { EncryptionService } from '@/Encryption/encryption.service'
import { UserController } from '@/User/user.controller'
import { LogService } from '@/Log/log.service'
import { EncryptionModule } from '@/Encryption/encryption.module'
import { LogModule } from '@/Log/log.module'
import { AuthService } from '@/Auth/auth.service'

@Module({
  imports: [TypeOrmModule.forFeature([User, Log])],
  providers: [UserService, EncryptionService, LogService, AuthService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
