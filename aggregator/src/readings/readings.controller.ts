import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpStatus,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtGuard } from "src/auth/guards";
import { DIDDTO, ReadingDTO, ReadingsFilterDTO, StartFilterDTO } from "./dto";
import { ReadingsService } from "./readings.service";

@UseInterceptors(ClassSerializerInterceptor)
@UsePipes(new ValidationPipe({ transform: true }))
@ApiTags("readings")
@ApiBearerAuth("JWT")
@UseGuards(JwtGuard)
@Controller("readings")
export class ReadingsController {
  constructor(private readonly readsService: ReadingsService) {}

  @ApiOperation({
    summary: "Return the readings for the specified DER",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Readings",
    type: ReadingDTO,
    isArray: true,
  })
  @Get("/:assetDID")
  public async getReads(
    @Param() { assetDID }: DIDDTO,
    @Query() filter: ReadingsFilterDTO,
  ) {
    const res = await this.readsService.findReadings(assetDID, filter);
    return res;
  }

  @ApiOperation({
    summary: "Return the last readings for the specified DER",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Readings",
    type: ReadingDTO,
  })
  @Get("/:assetDID/latest")
  public async getLatestRead(
    @Param("assetDID") assetDID: string,
    @Query() filter: StartFilterDTO,
  ) {
    return this.readsService.findLastReading(assetDID, filter.start);
  }

  @ApiOperation({
    summary: "Return the readings with the specified root hash",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Readings",
    type: ReadingDTO,
    isArray: true,
  })
  @Get("/roothash/:rootHash")
  public async getReadingsByRootHash(
    @Param("rootHash") rootHash: string,
    @Query() filter: ReadingsFilterDTO,
  ) {
    return this.readsService.findReadingsByRootHash(rootHash, filter);
  }
}
