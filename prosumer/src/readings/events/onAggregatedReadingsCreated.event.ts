import { AggregatedReadings } from "../entities";

export const onAggregatedReadingsId = "aggregatedReadings.created";

export class OnAggregatedReadingsCreated {
  constructor(public aggregatedReadings: AggregatedReadings) {}
}
