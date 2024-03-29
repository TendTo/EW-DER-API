import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Param,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtGuard } from "src/auth/guards";
import { AggregatedReadingsService } from "./aggregated-readings.service";
import {
  AggregatedReadingDTO,
  AggregatedReadingsDTO,
  AggregateReadingFilterDTO,
  AggregateReadingsByDIDsFilterDTO,
  AggregateReadingsByRootHashesFilterDTO,
  DIDDTO,
} from "./dto";
import { AggregatedGuard } from "./guards";

@UseInterceptors(ClassSerializerInterceptor)
@UsePipes(new ValidationPipe({ transform: true }))
@ApiTags("aggregated-readings")
@Controller("aggregated-readings")
export class AggregatedReadingsController {
  private readonly logger = new Logger(AggregatedReadingsController.name);

  constructor(private readonly aggregatedReadingsService: AggregatedReadingsService) {}

  @ApiOperation({ summary: "Store the list of aggregated readings" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "The list of aggregated readings has been stored",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      "The signature is invalid or the signer is not the owner of all the assets, the request is invalid or missing a required parameter",
  })
  @UseGuards(AggregatedGuard)
  @Post()
  public async storeAggregated(@Body() aggregated: AggregatedReadingsDTO) {
    this.logger.debug(`Storing aggregated readings: ${aggregated}`);
    await this.aggregatedReadingsService.store(aggregated);
  }

  @ApiOperation({
    summary:
      "Return the readings for the specified DER, aggregating the data with the provided query parameters",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Aggregated readings",
    type: AggregatedReadingDTO,
    isArray: true,
  })
  @ApiBearerAuth("JWT")
  @UseGuards(JwtGuard)
  @Get("assetDID/:assetDID")
  public getAggregatedReading(
    @Param() { assetDID }: DIDDTO,
    @Query() filter: AggregateReadingFilterDTO,
  ) {
    return this.aggregatedReadingsService.find([assetDID], filter);
  }

  @ApiOperation({
    summary:
      "Return the readings for the specified rootHash, aggregating the data with the provided query parameters",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Aggregated readings",
    type: AggregatedReadingDTO,
    isArray: true,
  })
  @ApiBearerAuth("JWT")
  @UseGuards(JwtGuard)
  @Post("assetDID")
  public getManyAggregatedReadingByAssetDID(
    @Body() { assetDIDs, ...options }: AggregateReadingsByDIDsFilterDTO,
  ) {
    return this.aggregatedReadingsService.find(assetDIDs, options);
  }

  @ApiOperation({
    summary:
      "Return the readings for the specified rootHash, aggregating the data with the provided query parameters",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Aggregated readings",
    type: AggregatedReadingDTO,
    isArray: true,
  })
  @ApiBearerAuth("JWT")
  @UseGuards(JwtGuard)
  @Get("roothash/:rootHash")
  public getAggregatedReadingByRootHash(
    @Param("rootHash") rootHash: string,
    @Query() filter: AggregateReadingFilterDTO,
  ) {
    return this.aggregatedReadingsService.findByRootHash([rootHash], filter);
  }

  @ApiOperation({
    summary:
      "Return the readings for the specified rootHash, aggregating the data with the provided query parameters",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Aggregated readings",
    type: AggregatedReadingDTO,
    isArray: true,
  })
  @ApiBearerAuth("JWT")
  @UseGuards(JwtGuard)
  @Post("rootHash")
  public getManyAggregatedReadingByRootHash(
    @Body() { rootHashes, ...options }: AggregateReadingsByRootHashesFilterDTO,
  ) {
    return this.aggregatedReadingsService.findByRootHash(rootHashes, options);
  }
}
