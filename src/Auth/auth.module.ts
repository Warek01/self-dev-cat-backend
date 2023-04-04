import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'

import { AuthService } from './auth.service'
import { EncryptionService } from '@/Encryption/encryption.service'
import { UserModule } from '@/User/user.module'
import { BasicStrategy } from "@/Auth/Strategy/basic.strategy";

@Module({
  imports: [UserModule, PassportModule],
  providers: [AuthService, EncryptionService, BasicStrategy],
  exports: [AuthService],
})
export class AuthModule {}
