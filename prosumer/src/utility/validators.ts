import { Matches, ValidationOptions } from "class-validator";

export function IsDID(validationOptions?: ValidationOptions) {
  return Matches(/^did:ethr:0x[0-9a-fA-F]{40}$/, {
    message:
      "Invalid format. Expected a DID. Check https://github.com/uport-project/ethr-did#did-method",
    ...validationOptions,
  });
}
