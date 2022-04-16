import {
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  UsePipes,
  ValidationPipe,
  Query,
  HttpStatus,
  Body,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { AddressDTO, JWTDTO, JWTRequestDTO, NonceDTO } from "./dto";
import { NonceGuard } from "./guards";

@UseInterceptors(ClassSerializerInterceptor)
@UsePipes(new ValidationPipe({ transform: true }))
@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: "Generate a nonce to use to request a JWT",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Nonce",
    type: NonceDTO,
  })
  @Get("nonce")
  async getNonce(@Query() { address }: AddressDTO) {
    return this.authService.generateNonce(address);
  }

  @ApiOperation({
    summary: "Request a new JWT using the nonce",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "New JWT",
    type: JWTDTO,
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: "The signature is invalid or the nonce has expired",
  })
  @UseGuards(NonceGuard)
  @Post("login")
  async login(@Body() req: JWTRequestDTO) {
    return this.authService.login(req);
  }
}
