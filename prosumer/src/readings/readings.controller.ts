import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { MeasurementDTO } from "./dto";
import { ReadingsService } from "./readings.service";

@Controller("readings")
export class ReadingsController {
  constructor(private readonly readingsService: ReadingsService) {}

  @Post()
  create(@Body() measurement: MeasurementDTO) {
    return this.readingsService.create(measurement);
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
