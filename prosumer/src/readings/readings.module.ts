import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PreciseProofsModule } from "src/precise-proofs/precise-proofs.module";
import { ReadingCreatedListener } from "./listeners";
import { ReadingsController } from "./readings.controller";
import { ReadingsService } from "./readings.service";

@Module({
  imports: [PreciseProofsModule, ConfigModule.forRoot(), HttpModule],
  controllers: [ReadingsController],
  providers: [ReadingsService, ReadingCreatedListener],
})
export class ReadingsModule {}
