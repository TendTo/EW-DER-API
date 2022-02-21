import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { ReadingsModule } from "./readings/readings.module";

@Module({
  imports: [ReadingsModule, ConfigModule.forRoot()],
  controllers: [AppController],
})
export class AppModule {}
