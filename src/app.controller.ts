import { Body, Controller, Get, Post } from '@nestjs/common'

@Controller()
export class AppController {
  @Get()
  getHello(): string {
    return process.env.NODE_ENV
  }

  @Post()
  async testPost(@Body() body: string) {
    console.log(body)

    return body
  }
}
