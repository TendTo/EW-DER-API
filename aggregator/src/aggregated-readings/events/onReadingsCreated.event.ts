import { AggregatedReadingsDTO } from "../dto";

export const onReadingsCreatedId = "aggregated.created";

export class OnReadingsCreated {
  constructor(public aggregated: AggregatedReadingsDTO) {}
}
