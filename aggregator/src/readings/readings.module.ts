import { Module } from "@nestjs/common";
import { PreciseProofsService } from "src/precise-proofs/precise-proofs.service";
import { ReadingsController } from "./readings.controller";
import { ReadingsService } from "./readings.service";

@Module({
  controllers: [ReadingsController],
  providers: [ReadingsService, PreciseProofsService],
})
export class ReadingsModule {}
