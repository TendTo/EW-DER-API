import { Injectable } from "@nestjs/common";
import { PreciseProofs } from "precise-proofs-js";
import { ReadingDTO } from "src/readings/dto";
import { PreciseProofDTO } from "./dto";

@Injectable()
export class PreciseProofsService {
  generatePreciseProof(
    readings: Omit<ReadingDTO, "unit">[],
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

  async sendPreciseProof(preciseProof: PreciseProofDTO) {
    //TODO: send precise proof to the EW-chain
    return "fest";
  }
}
