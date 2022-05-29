import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AggregatorGuard, JwtGuard } from "src/auth/guards";
import { Role } from "src/constants";
import { AssetService } from "./asset.service";
import { AssetDTO, AssetFilterDTO, AssetMatchFilterDTO } from "./dto";
import { AssetsFilterDTO } from "./dto/assetsFilter.dto";

@UseInterceptors(ClassSerializerInterceptor)
@UsePipes(new ValidationPipe({ transform: true }))
@ApiTags("assets")
@ApiBearerAuth("JWT")
@UseGuards(JwtGuard)
@Controller("assets")
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @ApiOperation({
    summary: "Return the list of available assetDIDs among the ones provided.",
  })
  @ApiResponse({ isArray: true, type: String })
  @Post()
  public async getAssetDIDs(@Body() filter: AssetFilterDTO) {
    return await this.assetService.findAssetDIDs(filter);
  }

  @ApiOperation({
    summary: "Return the list of available assetDIDs among the ones provided.",
  })
  @ApiResponse({ isArray: true, type: String })
  @UseGuards(AggregatorGuard)
  @Post("getAll")
  public async getAllAssetDIDs(@Body() filter: AssetsFilterDTO) {
    return await this.assetService.findAllAssetDIDs(filter);
  }

  @ApiOperation({
    summary: "Get the assets that have at least one value in the given time range.",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Readings",
    isArray: true,
    type: AssetDTO,
  })
  @Get("matches")
  getAssetsMatches(@Query() filter: AssetMatchFilterDTO) {
    return this.assetService.find(filter);
  }

  @ApiOperation({
    summary: "Return the list of available rootHashes among the assetDIDs provided.",
  })
  @ApiResponse({ isArray: true, type: String })
  @Post("rootHashes")
  public async getRootHashes(@Body() filter: AssetFilterDTO) {
    return await this.assetService.findRootHashes(filter);
  }
}
