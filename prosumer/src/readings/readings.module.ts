import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { BlockchainService } from "src/blockchain/blockchain.service";
import { PreciseProofsService } from "src/precise-proofs/precise-proofs.service";
import { AggregatedReadingsCreatedListener, ReadingCreatedListener } from "./listeners";
import { ReadingsController } from "./readings.controller";
import { ReadingsService } from "./readings.service";

@Module({
  imports: [HttpModule],
  controllers: [ReadingsController],
  providers: [
    ReadingsService,
    ReadingCreatedListener,
    AggregatedReadingsCreatedListener,
    PreciseProofsService,
    BlockchainService,
  ],
})
export class ReadingsModule {}
