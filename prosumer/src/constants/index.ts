export const MAX_SEND_QUANTITY = 10000;
export const DEFAULT_LIMIT = 2;

export enum Unit {
  Wh = "Wh",
  kWh = "kWh",
  MWh = "MWh",
  GWh = "GWh",
}

export enum Status {
  NotSubmitted = "NotSubmitted",
  Pending = "Pending",
  Accepted = "Accepted",
}
