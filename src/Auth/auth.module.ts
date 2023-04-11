import { Global, Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule, JwtService } from '@nestjs/jwt'
import dotenv from 'dotenv'

import { AuthService } from './auth.service'
import { EncryptionService } from '@/Encryption/encryption.service'
import { BasicStrategy } from '@/Auth/Strategy/basic.strategy'
import { LogService } from '@/Log/log.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Log } from '@/Entities'

dotenv.config()

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([Log]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      secretOrPrivateKey: process.env.JWT_SECRET,
      global: true,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
    }),
  ],
  providers: [AuthService, EncryptionService, BasicStrategy, JwtService, LogService],
  exports: [AuthService],
})
export class AuthModule {}
