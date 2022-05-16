import { Injectable, Logger } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { Order } from "../constants";
import { Reading } from "../readings/entities";
import { AggregatedReadingsDTO, AggregateReadingFilterDTO } from "./dto";
import { AggregatedReading } from "./entities";
import { OnReadingsCreated, onReadingsCreatedId } from "./events";

@Injectable()
export class AggregatedReadingsService {
  private readonly logger = new Logger(AggregatedReadingsService.name);

  constructor(private readonly eventEmitter: EventEmitter2) {}

  public async store(aggregated: AggregatedReadingsDTO) {
    const readings = aggregated.readings.map(
      (reading) => new Reading(reading, aggregated.rootHash),
    );
    await Reading.saveMany(readings);
    this.logger.debug(`Writing ${readings.length} readings to InfluxDB`, readings);

    this.eventEmitter.emit(onReadingsCreatedId, new OnReadingsCreated(aggregated));
  }

  public async find(
    assetDIDs: string[],
    {
      start,
      stop,
      limit = 100,
      offset = 0,
      order = Order.ASC,
      aggregationWindow,
      aggregationFunction,
      difference,
    }: AggregateReadingFilterDTO,
  ): Promise<AggregatedReading[]> {
    this.logger.debug("Reading readings from InfluxDB with DID:", assetDIDs);
    return AggregatedReading.find(assetDIDs, {
      range: { start, stop },
      limit: { limit, offset },
      aggregateWindow: { every: aggregationWindow, fn: aggregationFunction },
      order,
      difference,
    });
  }

  public async findByRootHash(
    rootHashes: string[],
    {
      start,
      stop,
      limit = 100,
      offset = 0,
      order = Order.ASC,
      aggregationWindow,
      aggregationFunction,
      difference,
    }: AggregateReadingFilterDTO,
  ): Promise<AggregatedReading[]> {
    this.logger.debug("Reading reading from InfluxDB with rootHash:", rootHashes);
    return AggregatedReading.findByRootHash(rootHashes, {
      range: { start, stop },
      limit: { limit, offset },
      aggregateWindow: { every: aggregationWindow, fn: aggregationFunction },
      order,
      difference,
    });
  }
}
