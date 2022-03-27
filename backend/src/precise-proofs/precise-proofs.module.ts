import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PreciseProofsService } from "./precise-proofs.service";

@Module({
  imports: [ConfigModule],
  providers: [PreciseProofsService],
  exports: [PreciseProofsService],
})
export class PreciseProofsModule {}
