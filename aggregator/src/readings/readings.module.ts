import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { BlockchainService } from "src/blockchain/blockchain.service";
import { PreciseProofsService } from "src/precise-proofs/precise-proofs.service";
import { ReadingsController } from "./readings.controller";
import { ReadingsService } from "./readings.service";

@Module({
  controllers: [ReadingsController],
  providers: [ReadingsService, PreciseProofsService, BlockchainService],
})
export class ReadingsModule {}
