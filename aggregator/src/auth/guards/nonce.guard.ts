import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
  CACHE_MANAGER,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { BlockchainService } from "src/blockchain/blockchain.service";
import { JWTRequestDTO } from "../dto";
import { Cache } from "cache-manager";

@Injectable()
export class NonceGuard implements CanActivate {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly blockchainService: BlockchainService,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request.body);
  }

  private async validateRequest({
    address,
    signedNonce,
  }: JWTRequestDTO): Promise<boolean> {
    const storedNonce = await this.cacheManager.get<string>(address);
    if (!storedNonce)
      throw new HttpException("Nonce not found or expired", HttpStatus.BAD_REQUEST);
    const signer = this.blockchainService.getSignatureAddress(
      storedNonce,
      signedNonce,
    );
    if (signer !== address) throw new HttpException("Invalid signature", HttpStatus.FORBIDDEN);
    return true;
  }
}
