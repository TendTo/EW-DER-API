import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ClassSerializerInterceptor,
  UseInterceptors,
  ValidationPipe,
  UsePipes,
  Logger,
  Query,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AggregatedReadingsService } from "./aggregated-readings.service";
import { AggregatedReadingsDTO, AggregateReadingsFilterDTO } from "./dto";

@UseInterceptors(ClassSerializerInterceptor)
@UsePipes(new ValidationPipe({ transform: true }))
@ApiTags("aggregated-readings")
@Controller("aggregated-readings")
export class AggregatedReadingsController {
  private readonly logger = new Logger(AggregatedReadingsController.name);

  constructor(
    private readonly aggregatedReadingsService: AggregatedReadingsService,
  ) {}

  @Post("/")
  public async storeAggregated(@Body() aggregated: AggregatedReadingsDTO) {
    Logger.debug(`Storing aggregated readings: ${aggregated}`);
    await this.aggregatedReadingsService.store(aggregated);
  }

  @Get("/:assetDID")
  public async getReadsAggregates(
    @Param("assetDID") assetDID: string,
    @Query() filter: AggregateReadingsFilterDTO,
  ) {
    return this.aggregatedReadingsService.find(assetDID, filter);
  }

  @Get("/roothash/:rootHash")
  public async getAggregatedReadingsByRootHash(
    @Param("rootHash") rootHash: string,
    @Query() filter: AggregateReadingsFilterDTO,
  ) {
    return this.aggregatedReadingsService.findByRootHash(rootHash, filter);
  }
}
