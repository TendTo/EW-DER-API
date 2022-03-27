export const DEFAULT_LIMIT = 10000;
export const DEFAULT_OFFSET = 0;

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

export enum Aggregate {
  Sum = "sum",
  Mean = "mean",
}

export type AllowedDurationType =
  | "1y"
  | "1mo"
  | "1w"
  | "1d"
  | "1h"
  | "30m"
  | "15m"
  | "now()";

export enum Status {
  Accepted = "Accepted",
  Rejected = "Rejected",
  Submitted = "Submitted",
}
