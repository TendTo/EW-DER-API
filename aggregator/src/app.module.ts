import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { AggregatedReadingsModule } from "./aggregated-readings/aggregated-readings.module";
import { AppController } from "./app.controller";
import { ReadingsModule } from "./readings/readings.module";
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ReadingsModule,
    ConfigModule.forRoot(),
    EventEmitterModule.forRoot(),
    AggregatedReadingsModule,
    AuthModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
