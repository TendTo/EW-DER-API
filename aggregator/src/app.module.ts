import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { AggregatedReadingsModule } from "./aggregated-readings/aggregated-readings.module";
import { AppController } from "./app.controller";
import { AssetModule } from "./asset/asset.module";
import { AuthModule } from "./auth/auth.module";
import { BlockchainModule } from "./blockchain/blockchain.module";
import { InfluxdbModule } from "./influxdb/influxdb.module";
import { ReadingsModule } from "./readings/readings.module";

@Module({
  imports: [
    AuthModule,
    AssetModule,
    ReadingsModule,
    AggregatedReadingsModule,
    ConfigModule.forRoot({ isGlobal: true }),
    InfluxdbModule.forRoot({ global: true }),
    BlockchainModule.forRoot({ global: true }),
    EventEmitterModule.forRoot({ global: true }),
  ],
  controllers: [AppController],
})
export class AppModule {}
