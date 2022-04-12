import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AggregatedReadingsDTO, ReadingDTO } from "./dto";
import { ReadingsService } from "./readings.service";

@UseInterceptors(ClassSerializerInterceptor)
@UsePipes(new ValidationPipe({ transform: true }))
@ApiTags("readings")
@Controller("readings")
export class ReadingsController {
  constructor(private readonly readingsService: ReadingsService) {}

  @ApiOperation({ summary: "Read all aggregated readings" })
  @ApiResponse({
    status: 200,
    description: "All aggregated readings",
    type: AggregatedReadingsDTO,
    isArray: true,
  })
  @Get("aggregatedReadings")
  findAllAggregatedReadings() {
    return this.readingsService.findAllAggregatedReadings();
  }

  @ApiOperation({ summary: "Store a new reading" })
  @ApiResponse({
    status: 201,
    description: "Stored a new reading",
    type: ReadingDTO,
  })
  @ApiResponse({
    status: 400,
    description: "Validation error",
  })
  @Post()
  create(@Body() reading: ReadingDTO) {
    return this.readingsService.create(reading);
  }

  @ApiOperation({ summary: "Read all stored reading" })
  @ApiResponse({
    status: 200,
    description: "All readings",
    type: ReadingDTO,
    isArray: true,
  })
  @Get()
  findAll() {
    return this.readingsService.findAll();
  }

  @ApiOperation({ summary: "Read the reading with the provided id" })
  @ApiResponse({
    status: 200,
    description: "Requeted reading",
    type: ReadingDTO,
  })
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.readingsService.findOne(+id);
  }

  @ApiOperation({ summary: "Delete the reading with the provided id" })
  @ApiResponse({
    status: 200,
    description: "The reading has been deleted",
  })
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.readingsService.remove(+id);
  }
}
