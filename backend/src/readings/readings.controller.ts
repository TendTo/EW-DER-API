import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";

import {
  AggregateFilterDTO,
  ReadingsFilterDTO,
  MeasurementDTO,
  PeriodFilterDTO,
} from "./dto";
import { ReadingsService } from "./readings.service";

@UseInterceptors(ClassSerializerInterceptor)
@UsePipes(new ValidationPipe({ transform: true }))
@Controller("readings")
export class ReadingsController {
  constructor(private readonly readsService: ReadingsService) {}

  @Get("/:meter")
  public async getReads(
    @Param("meter") meterId: string,
    @Query() filter: ReadingsFilterDTO,
  ) {
    const res = await this.readsService.find(meterId, filter);
    return res;
  }

  @Get("/:meter/difference")
  public async getReadsDifference(
    @Param("meter") meterId: string,
    @Query() filter: ReadingsFilterDTO,
  ) {
    const res = await this.readsService.findDifference(meterId, filter);
    return res;
  }

  @Get("/:meter/aggregate")
  public async getReadsAggregates(
    @Param("meter") meterId: string,
    @Query() filter: AggregateFilterDTO,
  ) {
    const res = await this.readsService.aggregate(meterId, filter);
    return res;
  }

  @Get("/:meter/latest")
  public async getLatestRead(
    @Param("meter") meterId: string,
    @Query() filter: PeriodFilterDTO,
  ) {
    const res = await this.readsService.findLatestRead(meterId, filter?.start);
    return res;
  }

  @Post("/:meter")
  public async storeReads(
    @Param("meter") meterId: string,
    @Body() measurement: MeasurementDTO,
  ) {
    await this.readsService.store(meterId, measurement);
  }
}
