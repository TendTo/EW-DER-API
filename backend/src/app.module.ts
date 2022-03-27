import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { ReadingsModule } from "./readings/readings.module";
import { PreciseProofsModule } from "./precise-proofs/precise-proofs.module";

@Module({
  imports: [ReadingsModule, ConfigModule.forRoot(), PreciseProofsModule],
  controllers: [AppController],
})
export class AppModule {}
