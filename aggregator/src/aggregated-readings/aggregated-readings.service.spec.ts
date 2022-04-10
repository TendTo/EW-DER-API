import { Test, TestingModule } from '@nestjs/testing';
import { AggregatedReadingsService } from './aggregated-readings.service';

describe('AggregatedReadingsService', () => {
  let service: AggregatedReadingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AggregatedReadingsService],
    }).compile();

    service = module.get<AggregatedReadingsService>(AggregatedReadingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
