import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { BlockchainService } from "src/blockchain/blockchain.service";
import { AggregatedReadingsDTO } from "../dto";
import { PreciseProofsService } from "src/precise-proofs/precise-proofs.service";

@Injectable()
export class AggregatedGuard implements CanActivate {
  constructor(
    private readonly preciseProofsService: PreciseProofsService,
    private readonly blockchainService: BlockchainService,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request.body);
  }

  private async validateRequest(
    aggregated: AggregatedReadingsDTO,
  ): Promise<boolean> {
    if (!this.preciseProofsService.validateAggregatedReadings(aggregated)) {
      throw new HttpException(
        "Invalid aggregated readings: root hash did not match",
        HttpStatus.FORBIDDEN,
      );
    }

    const user = this.blockchainService.getSignatureAddress(
      aggregated.rootHash,
      aggregated.signature,
    );

    if (!(await this.blockchainService.isOwner(user, aggregated.readings))) {
      throw new HttpException(
        "The user who signed the aggregated readings is not the owner of at least one asset",
        HttpStatus.FORBIDDEN,
      );
    }
    return true;
  }
}
