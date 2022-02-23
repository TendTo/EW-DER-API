import { Test, TestingModule } from '@nestjs/testing';
import { ReadingsService } from './readings.service';

describe('ReadingsService', () => {
  let service: ReadingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReadingsService],
    }).compile();

    service = module.get<ReadingsService>(ReadingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
