import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { ReadingDTO } from "./dto";
import { ReadingsService } from "./readings.service";

@Controller("readings")
export class ReadingsController {
  constructor(private readonly readingsService: ReadingsService) {}

  @Post()
  create(@Body() reading: ReadingDTO) {
    return this.readingsService.create(reading);
  }

  @Get()
  findAll() {
    return this.readingsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.readingsService.findOne(+id);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.readingsService.remove(+id);
  }
}
