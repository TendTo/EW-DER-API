import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { ReadingsModule } from "./readings/readings.module";

@Module({
  imports: [ReadingsModule],
  controllers: [AppController],
})
export class AppModule {}
