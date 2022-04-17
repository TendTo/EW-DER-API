import { Test, TestingModule } from "@nestjs/testing";
import { PreciseProofsService } from "./precise-proofs.service";

describe("PreciseProofsService", () => {
  let service: PreciseProofsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PreciseProofsService],
    }).compile();

    service = module.get<PreciseProofsService>(PreciseProofsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
