import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { PreciseProofsModule } from "src/precise-proofs/precise-proofs.module";
import { ReadingsController } from "./readings.controller";
import { ReadingsService } from "./readings.service";

@Module({
  imports: [ConfigModule, PreciseProofsModule],
  controllers: [ReadingsController],
  providers: [ReadingsService, ConfigService],
})
export class ReadingsModule {}
