import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpStatus,
  Query,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtGuard } from "src/auth/guards";
import { AssetService } from "./asset.service";
import { AssetDTO, AssetFilterDTO } from "./dto";

@UseInterceptors(ClassSerializerInterceptor)
@UsePipes(new ValidationPipe({ transform: true }))
@ApiTags("assets")
@ApiBearerAuth("JWT")
@UseGuards(JwtGuard)
@Controller("assets")
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @ApiOperation({
    summary: "Return the last readings for the specified DER",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Readings",
    isArray: true,
    type: AssetDTO,
  })
  @Get()
  getAssets(@Query() filter: AssetFilterDTO) {
    return this.assetService.find(filter);
  }
}
