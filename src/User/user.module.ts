import { Module } from '@nestjs/common'

import UserService from './user.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Log, User } from '@/Entities'
import { EncryptionService } from '@/Encryption/encryption.service'
import { UserController } from '@/User/user.controller'
import { LogService } from '@/Log/log.service'
import { AuthService } from '@/Auth/auth.service'
import FriendRequest from '@/Entities/FriendRequest'

@Module({
  imports: [TypeOrmModule.forFeature([User, Log, FriendRequest])],
  providers: [UserService, EncryptionService, LogService, AuthService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
