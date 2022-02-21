import { Controller, Get } from "@nestjs/common";

@Controller("ping")
export class AppController {
  constructor() {}

  @Get()
  getHello(): boolean {
    return true;
  }
}
