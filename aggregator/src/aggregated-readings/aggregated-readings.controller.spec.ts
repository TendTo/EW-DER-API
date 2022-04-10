import { Test, TestingModule } from '@nestjs/testing';
import { AggregatedReadingsController } from './aggregated-readings.controller';
import { AggregatedReadingsService } from './aggregated-readings.service';

describe('AggregatedReadingsController', () => {
  let controller: AggregatedReadingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AggregatedReadingsController],
      providers: [AggregatedReadingsService],
    }).compile();

    controller = module.get<AggregatedReadingsController>(AggregatedReadingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
