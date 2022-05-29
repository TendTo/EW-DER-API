export * from "./dynamic.module";
export * from "./influxDbRow.dto";
export * from "./limitFilter.dto";
export * from "./rangeFilter.dto";
export * from "./validators";

type BasicTypes =
  | "string"
  | "number"
  | "bigint"
  | "boolean"
  | "symbol"
  | "undefined"
  | "object"
  | "function";

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

/**
 * Check if the provided array contains only elements of a certain type.
 * @param array array to test the assertion on
 * @param type type of the elements
 * @returns whether the array contains only elements of the given type
 */
export function isTypeArray<T extends BasicTypes>(array: any, type: T): array is T[] {
  return Array.isArray(array) && array.every((element) => typeof element === type);
}
