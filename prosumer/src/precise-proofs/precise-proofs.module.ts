import { Module } from "@nestjs/common";
import { PreciseProofsService } from "./precise-proofs.service";

@Module({
  providers: [PreciseProofsService],
  exports: [PreciseProofsService],
})
export class PreciseProofsModule {}
