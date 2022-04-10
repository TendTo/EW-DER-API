import { Injectable } from "@nestjs/common";
import { PreciseProofs } from "precise-proofs-js";
import { ReadingDTO } from "src/readings/dto";
import { PreciseProofDTO } from "./dto";
import { Wallet, utils } from "ethers";

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
    const wallet = utils.isValidMnemonic(process.env.SK)
      ? Wallet.fromMnemonic(process.env.SK)
      : new Wallet(process.env.SK);

    return {
      rootHash,
      salts: leafs.map((leaf: PreciseProofs.Leaf) => leaf.salt),
      leafs,
      signature: await wallet.signMessage(rootHash),
    };
  }

  async sendPreciseProof(preciseProof: PreciseProofDTO) {
    //TODO: send precise proof to the EW-chain
    return "fest";
  }
}
