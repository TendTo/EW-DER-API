import { Test, TestingModule } from '@nestjs/testing';
import { InfluxdbService } from './influxdb.service';

describe('InfluxdbService', () => {
  let service: InfluxdbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InfluxdbService],
    }).compile();

    service = module.get<InfluxdbService>(InfluxdbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
