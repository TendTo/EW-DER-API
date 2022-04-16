export const MAX_SEND_QUANTITY = 10000;
export const DEFAULT_LIMIT = 2;
export const VOLTA_CHAIN = {
  chainId: 0x12047,
  name: "Volta",
  ensAddress: "0xd7CeF70Ba7efc2035256d828d5287e2D285CD1ac",
};

export enum Unit {
  Wh = "Wh",
  kWh = "kWh",
  MWh = "MWh",
  GWh = "GWh",
}

export enum Status {
  NotSubmitted = "NotSubmitted",
  Submitted = "Submitted",
  Rejected = "Rejected",
  Confirmed = "Confirmed",
}

export enum Config {
  AGGREGATION_THRESHOLD = "AGGREGATION_THRESHOLD",
  AGGREGATOR_URL = "AGGREGATOR_URL",
  SK = "SK",
  READINGS_NOTARY_ADDRESS = "READINGS_NOTARY_ADDRESS",
  VOLTA_URL = "VOLTA_URL",
  PORT = "PORT",
}
