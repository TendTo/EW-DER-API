import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { BlockchainService } from "src/blockchain/blockchain.service";
import { PreciseProofsService } from "src/precise-proofs/precise-proofs.service";
import { Order } from "../constants";
import { AggregatedReadingsDTO, AggregateReadingsFilterDTO } from "./dto";
import { Reading } from "../readings/entities";

@Injectable()
export class AggregatedReadingsService {
  private readonly logger = new Logger(AggregatedReadingsService.name);

  constructor(
    private readonly preciseProofsService: PreciseProofsService,
    private readonly blockchainService: BlockchainService,
  ) {}

  public async store(aggregated: AggregatedReadingsDTO) {
    if (!this.preciseProofsService.validateAggregatedReadings(aggregated)) {
      throw new HttpException(
        "Invalid aggregated readings: root hash did not match",
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = this.blockchainService.getSignatureAddress(
      aggregated.rootHash,
      aggregated.signature,
    );

    if (!(await this.blockchainService.isOwner(user, aggregated.readings))) {
      throw new HttpException(
        "The user who signed the aggregated readings is not the owner of at least one asset",
        HttpStatus.BAD_REQUEST,
      );
    }

    const readings = aggregated.readings.map(
      (reading) => new Reading(reading, aggregated.rootHash),
    );
    await Reading.saveMany(readings);
    this.logger.debug(
      `Writing ${readings.length} readings to InfluxDB`,
      readings,
    );
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
    return Reading.findMany(assetDID, {
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
