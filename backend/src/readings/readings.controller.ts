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
  StartFilterDTO,
  AggregatedReadingsDTO,
  AggregateReadingsFilterDTO,
} from "./dto";
import { ReadingsService } from "./readings.service";

@UseInterceptors(ClassSerializerInterceptor)
@UsePipes(new ValidationPipe({ transform: true }))
@Controller("readings")
export class ReadingsController {
  constructor(private readonly readsService: ReadingsService) {}

  @Post("/")
  public async storeAggregated(@Body() aggregated: AggregatedReadingsDTO) {
    Logger.debug(`Storing aggregated readings: ${aggregated}`);
    await this.readsService.storeAggregateReadings(aggregated);
  }

  @Get("/:assetDID")
  public async getReads(
    @Param("assetDID") assetDID: string,
    @Query() filter: ReadingsFilterDTO,
  ) {
    const res = await this.readsService.findReadings(assetDID, filter);
    return res;
  }

  @Get("/:assetDID/aggregate")
  public async getReadsAggregates(
    @Param("assetDID") assetDID: string,
    @Query() filter: AggregateReadingsFilterDTO,
  ) {
    return this.readsService.findAggregatedReadings(assetDID, filter);
  }

  @Get("/:assetDID/latest")
  public async getLatestRead(
    @Param("assetDID") assetDID: string,
    @Query() filter: StartFilterDTO,
  ) {
    return this.readsService.findLastReading(assetDID, filter.start);
  }

  @Get("/roothash/:rootHash")
  public async getReadingsByRootHash(
    @Param("rootHash") rootHash: string,
    @Query() filter: ReadingsFilterDTO,
  ) {
    return this.readsService.findReadingsByRootHash(rootHash, filter);
  }

  @Get("/roothash/:rootHash/aggregated")
  public async getAggregatedReadingsByRootHash(
    @Param("rootHash") rootHash: string,
    @Query() filter: AggregateReadingsFilterDTO,
  ) {
    return this.readsService.findAggregatedReadingsByRootHash(rootHash, filter);
  }
}
