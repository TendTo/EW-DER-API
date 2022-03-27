import { Injectable } from "@nestjs/common";
import { PreciseProofs } from "precise-proofs-js";
import { AggregatedReadingsDTO, ReadingDTO } from "src/readings/dto";
import { PreciseProofDTO } from "./dto";

@Injectable()
export class PreciseProofsService {
  generatePreciseProof(
    readings: ReadingDTO[],
    salts?: string[],
  ): PreciseProofDTO {
    const readingsToStore = readings.map(({ assetDID, timestamp, value }) => ({
      assetDID,
      timestamp,
      value,
    }));
    let leafs = salts
      ? PreciseProofs.createLeafs(readingsToStore, salts)
      : PreciseProofs.createLeafs(readingsToStore);

    leafs = PreciseProofs.sortLeafsByKey(leafs);

    const merkleTree = PreciseProofs.createMerkleTree(
      leafs.map((leaf: PreciseProofs.Leaf) => leaf.hash),
    );

    return {
      rootHash: PreciseProofs.getRootHash(merkleTree),
      salts: leafs.map((leaf: PreciseProofs.Leaf) => leaf.salt),
      leafs,
    };
  }

  validateAggregatedReadings(aggregatedReadings: AggregatedReadingsDTO) {
    const preciseProof = this.generatePreciseProof(
      aggregatedReadings.readings,
      aggregatedReadings.salts,
    );
    return preciseProof.rootHash === aggregatedReadings.rootHash;
  }

  async sendPreciseProof(preciseProof: PreciseProofDTO) {
    //TODO: send precise proof to the EW-chain
    return "fest";
  }
}
