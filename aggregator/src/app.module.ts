import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { ReadingsModule } from "./readings/readings.module";
import { AggregatedReadingsModule } from './aggregated-readings/aggregated-readings.module';

@Module({
  imports: [ReadingsModule, ConfigModule.forRoot(), AggregatedReadingsModule],
  controllers: [AppController],
})
export class AppModule {}
