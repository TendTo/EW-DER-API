export * from "./dynamic.module";
export * from "./validators";

/**
 * Calculate the unix timestamp of the given date.
 * @param timestamp string timestamp
 * @returns unix timestamp
 */
export function getUnixTimeFromTimestamp(timestamp: string) {
  return new Date(timestamp).getTime();
}

/**
 * Parse DIDs of the format did:ethr:0x... to the format 0x...
 * or 0x... if it is already an address
 * @param DID decentralized identifier of the asset
 * @returns address of the asset
 */
export function getAddressFromDID(DID: string): string {
  return DID.split(":")[2] || DID;
}
