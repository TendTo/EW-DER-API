import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { AggregatedReadingsModule } from "./aggregated-readings/aggregated-readings.module";
import { AppController } from "./app.controller";
import { ReadingsModule } from "./readings/readings.module";
import { AuthModule } from "./auth/auth.module";
import { InfluxdbModule } from "./influxdb/influxdb.module";
import { BlockchainModule } from "./blockchain/blockchain.module";

@Module({
  imports: [
    ReadingsModule,
    ConfigModule.forRoot({ isGlobal: true }),
    EventEmitterModule.forRoot({ global: true }),
    InfluxdbModule.forRoot({ global: true }),
    BlockchainModule.forRoot({ global: true }),
    AggregatedReadingsModule,
    AuthModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
