export * from "./dynamic.module";
import { Matches } from "class-validator";

export function IsInfluxTime() {
  return Matches(
    /^(?:-(?:\d+(ns|us|ms|mo|s|h|d|w|y|m))+(?<!\d?\1\d.*)(?!.*\d\1\d?)|\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z)$/,
    {
      message:
        "Invalid format. Expected a negative duration or a date-string. Check https://docs.influxdata.com/flux/v0.x/data-types/basic/duration/#duration-syntax",
    },
  );
}

export function IsInfluxDuration() {
  return Matches(
    /^(?:\d+(ns|us|ms|mo|s|h|d|w|y|m))+(?<!\d?\1\d.*)(?!.*\d\1\d?)$/,
    {
      message:
        "Invalid format. Expected a duration. Check https://docs.influxdata.com/flux/v0.x/data-types/basic/duration/#duration-syntax",
    },
  );
}

export function GetUnixTimeFromTimestamp(timestamp: string) {
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
