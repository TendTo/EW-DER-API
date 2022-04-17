import { Module } from "@nestjs/common";
import { PreciseProofsService } from "src/precise-proofs/precise-proofs.service";
import { AggregatedReadingsController } from "./aggregated-readings.controller";
import { AggregatedReadingsService } from "./aggregated-readings.service";
import { ReadingCreatedListener } from "./listeners";

@Module({
  controllers: [AggregatedReadingsController],
  providers: [
    AggregatedReadingsService,
    PreciseProofsService,
    ReadingCreatedListener,
  ],
})
export class AggregatedReadingsModule {}
