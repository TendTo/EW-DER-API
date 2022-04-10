import { Injectable } from "@nestjs/common";
import { PreciseProofs } from "precise-proofs-js";
import { ReadingDTO } from "src/readings/dto";
import { PreciseProofDTO } from "./dto";
import { Wallet } from "ethers";

@Injectable()
export class PreciseProofsService {
  async generatePreciseProof(
    readings: Omit<ReadingDTO, "unit">[],
    salts?: string[],
  ): Promise<PreciseProofDTO> {
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

    const rootHash = PreciseProofs.getRootHash(merkleTree);
    return {
      rootHash,
      salts: leafs.map((leaf: PreciseProofs.Leaf) => leaf.salt),
      leafs,
      signature: await new Wallet(process.env.PK ?? "").signMessage(rootHash),
    };
  }

  async sendPreciseProof(preciseProof: PreciseProofDTO) {
    //TODO: send precise proof to the EW-chain
    return "fest";
  }
}
