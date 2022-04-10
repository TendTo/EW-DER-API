import { Module } from "@nestjs/common";
import { AggregatedReadingsService } from "./aggregated-readings.service";
import { AggregatedReadingsController } from "./aggregated-readings.controller";
import { PreciseProofsService } from "src/precise-proofs/precise-proofs.service";
import { BlockchainService } from "src/blockchain/blockchain.service";

@Module({
  controllers: [AggregatedReadingsController],
  providers: [
    AggregatedReadingsService,
    PreciseProofsService,
    BlockchainService,
  ],
})
export class AggregatedReadingsModule {}
