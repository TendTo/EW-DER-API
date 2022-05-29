import type { JsonRpcProvider } from "@ethersproject/providers";
import { PreciseProofs } from "precise-proofs-js";
import { ReadingDTO } from "./reading";
import { BaseRepository } from "./repository";

export type ReducedReadingDTO = Omit<ReadingDTO, "rootHash">;

type AggregatedReadingsDTO = {
  start: string;
  stop: string;
  rootHash: string;
  salts: string[];
  readings: ReducedReadingDTO[];
  status: "Submitted";
  signature: string;
};

export class AggregatedReadings {
  static readonly repository = new BaseRepository();
  public readonly start: string;
  public readonly stop: string;
  public readonly rootHash: string;
  public readonly salts: string[];
  public readonly readings: ReducedReadingDTO[];
  public readonly status: "Submitted";
  public _signature: string;

  constructor(readings: ReducedReadingDTO[]);
  constructor(aggregatedReading: AggregatedReadingsDTO);
  constructor(input: ReducedReadingDTO[] | AggregatedReadingsDTO) {
    if (Array.isArray(input)) {
      const { rootHash, salts } = this.generatePreciseProof(input);
      this.start = input[0].timestamp;
      this.stop = input[input.length - 1].timestamp;
      this.rootHash = rootHash;
      this.salts = salts;
      this.readings = input;
      this.status = "Submitted";
      this._signature = "";
    } else {
      this.start = input.start;
      this.stop = input.stop;
      this.rootHash = input.rootHash;
      this.salts = input.salts;
      this.readings = input.readings;
      this.status = input.status;
      this._signature = input.signature;
    }
  }

  public async send() {
    if (!this.isSigned) throw new Error("Aggregated readings must be signed");

    const res = await AggregatedReadings.repository.apiRequest("aggregated-readings", {
      method: "POST",
      body: this.dto,
    });
    if (res.status !== 200) {
      const message = (await res.json()).message;
      switch (message) {
        case "The user who signed the aggregated readings is not the owner of at least one asset":
          throw new Error("ERROR.NOT_OWNER");
        default:
          throw new Error();
      }
    }
  }

  private generatePreciseProof(readings: ReducedReadingDTO[], salts?: string[]) {
    const sanitizedReading = readings.map(({ assetDID, timestamp, value }) => ({
      assetDID,
      timestamp,
      value,
    }));

    let leafs = salts
      ? PreciseProofs.createLeafs(sanitizedReading, salts)
      : PreciseProofs.createLeafs(sanitizedReading);

    leafs = PreciseProofs.sortLeafsByKey(leafs);

    const merkleTree = PreciseProofs.createMerkleTree(
      leafs.map((leaf: PreciseProofs.Leaf) => leaf.hash),
    );

    return {
      rootHash: PreciseProofs.getRootHash(merkleTree),
      salts: leafs.map((leaf: PreciseProofs.Leaf) => leaf.salt),
    };
  }

  public async sign(provider: JsonRpcProvider) {
    this._signature = await provider.getSigner().signMessage(this.rootHash);
  }

  public get isSigned(): boolean {
    return this._signature !== "";
  }

  public get signature(): string {
    return this._signature;
  }

  public get dto(): AggregatedReadingsDTO {
    return {
      start: this.start,
      stop: this.stop,
      rootHash: this.rootHash,
      salts: this.salts,
      readings: this.readings,
      status: this.status,
      signature: this._signature,
    };
  }
}
