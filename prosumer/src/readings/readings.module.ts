import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { BlockchainService } from "src/blockchain/blockchain.service";
import { PreciseProofsService } from "src/precise-proofs/precise-proofs.service";
import { ReadingCreatedListener } from "./listeners";
import { ReadingsController } from "./readings.controller";
import { ReadingsService } from "./readings.service";

@Module({
  imports: [ConfigModule.forRoot(), HttpModule],
  controllers: [ReadingsController],
  providers: [
    ReadingsService,
    ReadingCreatedListener,
    PreciseProofsService,
    BlockchainService,
  ],
})
export class ReadingsModule {}
