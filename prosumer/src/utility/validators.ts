import { Matches } from "class-validator";

export function IsDID() {
  return Matches(/^(did:ethr:)?(0x)?[0-9a-f]{40}$/, {
    message:
      "Invalid format. Expected a DID. Check https://github.com/uport-project/ethr-did#did-method",
  });
}
