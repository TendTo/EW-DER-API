import { PreciseProofs } from "precise-proofs-js";

export class PreciseProofDTO {
  rootHash: string;
  salts: string[];
  leafs: PreciseProofs.Leaf[];
  signature: string;
}
