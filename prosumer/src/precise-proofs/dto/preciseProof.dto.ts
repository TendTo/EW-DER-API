import { PreciseProofs } from "precise-proofs-js";

export class PreciseProofDTO {
  rootHash: string;
  hashedRootHash: string;
  salts: string[];
  leafs: PreciseProofs.Leaf[];
  signature: string;
}
