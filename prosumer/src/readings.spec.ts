import { Test, TestingModule } from "@nestjs/testing";
import { Readings } from "./readings";

describe("Readings", () => {
  let provider: Readings;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Readings],
    }).compile();

    provider = module.get<Readings>(Readings);
  });

  it("should be defined", () => {
    expect(provider).toBeDefined();
  });
});
