import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { BlockchainService } from "src/blockchain/blockchain.service";
import { PreciseProofsService } from "src/precise-proofs/precise-proofs.service";
import { ReadingsController } from "./readings.controller";
import { ReadingsService } from "./readings.service";

@Module({
  imports: [ConfigModule],
  controllers: [ReadingsController],
  providers: [
    ReadingsService,
    ConfigService,
    PreciseProofsService,
    BlockchainService,
  ],
})
export class ReadingsModule {}
