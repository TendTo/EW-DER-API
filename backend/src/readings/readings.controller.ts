import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Query,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";

import {
  ReadingsFilterDTO,
  PeriodFilterDTO,
  AggregatedReadingsDTO,
} from "./dto";
import { ReadingsService } from "./readings.service";

@UseInterceptors(ClassSerializerInterceptor)
@UsePipes(new ValidationPipe({ transform: true }))
@Controller("readings")
export class ReadingsController {
  constructor(private readonly readsService: ReadingsService) {}

  @Get("/:assetDID")
  public async getReads(
    @Param("assetDID") assetDID: string,
    @Query() filter: ReadingsFilterDTO,
  ) {
    const res = await this.readsService.findReadings(assetDID, filter);
    return res;
  }

  // @Get("/:meter/difference")
  // public async getReadsDifference(
  //   @Param("meter") assetDID: string,
  //   @Query() filter: ReadingsFilterDTO,
  // ) {
  //   const res = await this.readsService.findDifference(assetDID, filter);
  //   return res;
  // }

  // @Get("/:meter/aggregate")
  // public async getReadsAggregates(
  //   @Param("meter") assetDID: string,
  //   @Query() filter: AggregateFilterDTO,
  // ) {
  //   return this.readsService.aggregate(assetDID, filter);
  // }

  @Get("/:assetDID/latest")
  public async getLatestRead(
    @Param("assetDID") assetDID: string,
    @Query() filter: PeriodFilterDTO,
  ) {
    return this.readsService.findLastReading(assetDID, filter?.start);
  }

  // This endpoint should not be used, since the readings are only sent when aggregated
  // @Post("/:meter")
  // public async storeReads(
  //   @Param("meter") assetDID: string,
  //   @Body() reading: ReadingDTO,
  // ) {
  //   await this.readsService.storeReading({ ...reading, assetDID });
  // }

  @Post("/")
  public async storeAggregated(@Body() aggregated: AggregatedReadingsDTO) {
    Logger.debug(`Storing aggregated readings: ${aggregated}`);
    await this.readsService.storeAggregateReadings(aggregated);
  }
}
