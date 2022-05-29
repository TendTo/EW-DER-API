import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from "@nestjs/common";
import { Request } from "express";
import { BlockchainService } from "src/blockchain/blockchain.service";

type User = {
  address: string;
  signedNonce: string;
};

@Injectable()
export class AggregatorGuard implements CanActivate {
  constructor(private readonly blockchainService: BlockchainService) {}

  canActivate(context: ExecutionContext) {
    const user = context.switchToHttp().getRequest<Request>().user as User;
    if (!user || !("address" in user))
      throw new HttpException("You are not logged in", HttpStatus.UNAUTHORIZED);
    if (!this.blockchainService.isAggregator(user.address))
      throw new HttpException("You are not an aggregator", HttpStatus.FORBIDDEN);
    return true;
  }
}
