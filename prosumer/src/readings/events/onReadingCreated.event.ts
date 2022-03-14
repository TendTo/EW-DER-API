import { Reading } from "../entities";

export const onReadingCreatedId = "measurement.created";

export class OnReadingCreated {
  constructor(public reading: Reading) {}
}
