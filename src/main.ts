import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import dotenv from 'dotenv'

dotenv.config()

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    logger:
      process.env.NODE_ENV === 'production'
        ? ['log', 'error']
        : ['verbose', 'debug', 'log', 'error', 'warn'],
    abortOnError: process.env.NODE_ENV === 'debug',
    forceCloseConnections: process.env.NODE_ENV === 'debug',
    bodyParser: true,
  })
  await app.listen(process.env.PORT || 3000)
}

bootstrap()
