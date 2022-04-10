export const DEFAULT_LIMIT = 100;
export const DEFAULT_OFFSET = 0;
export const INFLUX_DURATION_REGEX =
  "^(?:\\d+(ns|us|ms|mo|s|h|d|w|y|m))+(?<!\\d?\\1\\d.*)(?!.*\\d\\1\\d?)$";
export const INFLUX_TIME_REGEX =
  "^(?:-(?:\\d+(ns|us|ms|mo|s|h|d|w|y|m))+(?<!\\d?\\1\\d.*)(?!.*\\d?\\1\\d)|\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}Z)$";
export const VOLTA_CHAIN = {
  chainId: 0x12047,
  name: "Volta",
  ensAddress: "0xd7CeF70Ba7efc2035256d828d5287e2D285CD1ac",
};

export enum Order {
  ASC = "ASC",
  DESC = "DESC",
}

export enum Unit {
  Wh = "Wh",
  kWh = "kWh",
  MWh = "MWh",
  GWh = "GWh",
}

export enum Status {
  Accepted = "Accepted",
  Rejected = "Rejected",
  Submitted = "Submitted",
}

export enum AggregationFunction {
  sum = "sum",
  mean = "mean",
  last = "last",
  max = "max",
  min = "min",
  count = "count",
}

export type DurationUnit =
  | "ns"
  | "us"
  | "mo"
  | "ms"
  | "s"
  | "m"
  | "h"
  | "d"
  | "w"
  | "mo"
  | "y";
