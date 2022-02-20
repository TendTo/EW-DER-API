import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { ReadingsService } from "./readings.service";
import { CreateReadingDto } from "./dto/create-reading.dto";
import { UpdateReadingDto } from "./dto/update-reading.dto";

@Controller("readings")
export class ReadingsController {
  constructor(private readonly readingsService: ReadingsService) {}

  @Post()
  create(@Body() createReadingDto: CreateReadingDto) {
    return this.readingsService.create(createReadingDto);
  }

  @Get()
  findAll() {
    return this.readingsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.readingsService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateReadingDto: UpdateReadingDto) {
    return this.readingsService.update(+id, updateReadingDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.readingsService.remove(+id);
  }
}
