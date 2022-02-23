import { Module } from '@nestjs/common';
import { ReadingsService } from './readings.service';
import { ReadingsController } from './readings.controller';

@Module({
  controllers: [ReadingsController],
  providers: [ReadingsService]
})
export class ReadingsModule {}
