import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Query,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtGuard } from "src/auth/guards";
import { AssetService } from "./asset.service";
import { AssetFilterDTO } from "./dto";

@UseInterceptors(ClassSerializerInterceptor)
@UsePipes(new ValidationPipe({ transform: true }))
@ApiTags("assets")
@ApiBearerAuth("JWT")
@UseGuards(JwtGuard)
@Controller("assets")
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @Get()
  getAssets(@Query() filter: AssetFilterDTO) {
    return this.assetService.find(filter);
  }
}
