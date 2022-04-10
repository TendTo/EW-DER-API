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
import { ApiTags } from "@nestjs/swagger";
import { ReadingsFilterDTO, StartFilterDTO } from "./dto";
import { ReadingsService } from "./readings.service";

@UseInterceptors(ClassSerializerInterceptor)
@UsePipes(new ValidationPipe({ transform: true }))
@ApiTags("readings")
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
}
