import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AppController } from './app.controller'
import { UserModule } from '@/User/user.module'
import { EncryptionModule } from '@/Encryption/encryption.module'
import { LogModule } from '@/Log/log.module'
import { Log, UsefulResource, User } from '@/Entities'
import { AuthModule } from '@/Auth/auth.module'
import { BlogModule } from '@/Blog/blog.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: process.env.NODE_ENV === 'production',
      isGlobal: true,
      envFilePath: ['.env.debug', '.env.local', '.env.prod', '.env'],
    }),
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as any,
      port: Number(process.env.DB_PORT),
      database: process.env.DB_DATABASE,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      schema: process.env.DB_DEFAULT_SCHEMA,
      synchronize: process.env.NODE_ENV === 'debug',
      debug: process.env.NODE_ENV === 'debug',
      cache: process.env.NODE_ENV === 'production',
      autoLoadEntities: true,
      applicationName: 'self-dev-cat-backend',
      auto_reconnect: true,
      relationLoadStrategy: 'join',
    }),
    TypeOrmModule.forFeature([UsefulResource, User, Log]),
    LogModule,
    UserModule,
    EncryptionModule,
    AuthModule,
    BlogModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
