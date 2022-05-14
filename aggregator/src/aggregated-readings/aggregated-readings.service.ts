import { Injectable, Logger } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { Order } from "../constants";
import { Reading } from "../readings/entities";
import { AggregatedReadingsDTO, AggregateReadingsFilterDTO } from "./dto";
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
    assetDID: string,
    {
      start,
      stop,
      limit = 100,
      offset = 0,
      order = Order.ASC,
      aggregationWindow,
      aggregationFunction,
      difference,
    }: AggregateReadingsFilterDTO,
  ): Promise<Reading[]> {
    this.logger.debug("Reading readings from InfluxDB:", assetDID);
    return Reading.find(assetDID, {
      range: { start, stop },
      limit: { limit, offset },
      aggregateWindow: { every: aggregationWindow, fn: aggregationFunction },
      order,
      difference,
    });
  }

  public async findByRootHash(
    rootHash: string,
    {
      start,
      stop,
      limit = 100,
      offset = 0,
      order = Order.ASC,
      aggregationWindow,
      aggregationFunction,
      difference,
    }: AggregateReadingsFilterDTO,
  ): Promise<Reading[]> {
    this.logger.debug("Reading reading from InfluxDB:", rootHash);
    return Reading.findByRootHash(rootHash, {
      range: { start, stop },
      limit: { limit, offset },
      aggregateWindow: { every: aggregationWindow, fn: aggregationFunction },
      order,
      difference,
    });
  }
}
