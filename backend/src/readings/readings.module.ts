import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ReadingsController } from "./readings.controller";
import { ReadingsService } from "./readings.service";

@Module({
  controllers: [ReadingsController],
  providers: [ReadingsService, ConfigService],
})
export class ReadingsModule {}
