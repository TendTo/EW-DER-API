import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { OnAggregatedReadingsCreated, onAggregatedReadingsId } from "../events";
import { ReadingsService } from "../readings.service";

@Injectable()
export class AggregatedReadingsCreatedListener {
  private readonly logger = new Logger(AggregatedReadingsCreatedListener.name);

  constructor(private readonly readingsService: ReadingsService) {}

  @OnEvent(onAggregatedReadingsId)
  async handleAggregatedReadingsCreatedEvent(event: OnAggregatedReadingsCreated) {
    const rootHash = event.aggregatedReadings.rootHash;
    this.logger.debug(`Aggregated readings created: ${rootHash}`);
    this.readingsService.sendAggregateReadings(rootHash);
  }
}
