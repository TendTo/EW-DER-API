import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpStatus,
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
import {
  DIDDTO,
  ListingFilterDTO,
  ReadingDTO,
  ReadingsByDIDsFilterDTO,
  ReadingsByRootHashesFilterDTO,
  ReadingsFilterDTO,
  StartFilterDTO,
} from "./dto";
import { ReadingsService } from "./readings.service";

const ReadingListResponse = {
  status: HttpStatus.OK,
  description: "Lists of Readings",
  type: ReadingDTO,
  isArray: true,
};

@UseInterceptors(ClassSerializerInterceptor)
@UsePipes(new ValidationPipe({ transform: true }))
@ApiTags("readings")
@ApiBearerAuth("JWT")
@UseGuards(JwtGuard)
@Controller("readings")
export class ReadingsController {
  constructor(private readonly readsService: ReadingsService) {}

  @ApiOperation({
    summary: "Return the list of available assetDIDs",
  })
  @ApiResponse({ isArray: true, type: String })
  @Post("assetDIDs")
  public async getAssetDIDs(@Body() filter: ListingFilterDTO) {
    return await this.readsService.findAssetDIDs(filter);
  }

  @ApiOperation({
    summary: "Return the readings for all the specified DERs",
  })
  @ApiResponse(ReadingListResponse)
  @Post("assetDID")
  public async getReadsByAssetDIDs(
    @Body() { assetDIDs, ...filter }: ReadingsByDIDsFilterDTO,
  ) {
    return await this.readsService.findManyReadings(assetDIDs, filter);
  }

  @ApiOperation({
    summary: "Return the readings for the specified DER",
  })
  @ApiResponse(ReadingListResponse)
  @Get("assetDID/:assetDID")
  public async getReads(
    @Param() { assetDID }: DIDDTO,
    @Query() filter: ReadingsFilterDTO,
  ) {
    return await this.readsService.findReadings(assetDID, filter);
  }

  @ApiOperation({
    summary: "Return the last readings for the specified DER",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Readings",
    type: ReadingDTO,
  })
  @Get("assetDID/:assetDID/latest")
  public async getLatestRead(
    @Param("assetDID") assetDID: string,
    @Query() filter: StartFilterDTO,
  ) {
    return this.readsService.findLastReading(assetDID, filter.start);
  }

  @ApiOperation({
    summary: "Return the list of available rootHashes",
  })
  @ApiResponse({ isArray: true, type: String })
  @Post("rootHashes")
  public async getRootHashes(@Body() filter: ListingFilterDTO) {
    return await this.readsService.findRootHashes(filter);
  }

  @ApiOperation({
    summary: "Return the readings for all the specified root hashes",
  })
  @ApiResponse(ReadingListResponse)
  @Post("roothash")
  public async getReadsByRootHashes(
    @Body() { rootHashes, ...filter }: ReadingsByRootHashesFilterDTO,
  ) {
    return await this.readsService.findManyReadingsByRootHash(rootHashes, filter);
  }

  @ApiOperation({
    summary: "Return the readings with the specified root hash",
  })
  @ApiResponse(ReadingListResponse)
  @Get("roothash/:rootHash")
  public async getReadingsByRootHash(
    @Param("rootHash") rootHash: string,
    @Query() filter: ReadingsFilterDTO,
  ) {
    return this.readsService.findReadingsByRootHash(rootHash, filter);
  }
}
