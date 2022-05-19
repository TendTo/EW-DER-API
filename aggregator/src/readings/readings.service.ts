import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { InfluxdbService } from "src/influxdb/influxdb.service";
import { Order } from "../constants";
import { ListingFilterDTO, ReadingDTO, ReadingsFilterDTO } from "./dto";
import { AssetDID, Reading, RootHash } from "./entities";

@Injectable()
export class ReadingsService implements OnModuleInit {
  private readonly logger = new Logger(ReadingsService.name);

  constructor(private readonly influxDbService: InfluxdbService) {}

  public async onModuleInit() {
    Reading.influxDBRepository = this.influxDbService;
    RootHash.influxDBRepository = this.influxDbService;
    AssetDID.influxDBRepository = this.influxDbService;
  }

  public async storeReading(reading: ReadingDTO) {
    const newReading = new Reading(reading);
    await newReading.save();
    this.logger.debug("Writing reading to InfluxDB:", newReading);
  }

  public async findOneReading(
    assetDID: string,
    { start, stop }: ReadingsFilterDTO,
  ): Promise<Reading> {
    this.logger.debug("Reading reading from InfluxDB:", assetDID);
    return Reading.findOne(assetDID, { range: { start, stop } });
  }

  public async findReadings(
    assetDID: string,
    { start, stop, limit = 100, offset = 0, order = Order.ASC }: ReadingsFilterDTO,
  ): Promise<Reading[]> {
    this.logger.debug("Reading readings from InfluxDB:", assetDID);
    return Reading.find(assetDID, {
      range: { start, stop },
      limit: { limit, offset },
      order,
    });
  }

  public async findManyReadings(
    assetDID: string[],
    { start, stop, limit = 100, offset = 0, order = Order.ASC }: ReadingsFilterDTO,
  ): Promise<Reading[][]> {
    this.logger.debug("Reading readings from InfluxDB:", assetDID);
    return Reading.findMany(assetDID, {
      range: { start, stop },
      limit: { limit, offset },
      order,
    });
  }

  public async findLastReading(assetDID: string, start: string): Promise<Reading> {
    this.logger.debug(`Reading last reading from InfluxDB (start: ${start}):`, assetDID);
    return Reading.findLast(assetDID, start);
  }

  public async findReadingsByRootHash(
    rootHash: string,
    { start, stop, limit = 100, offset = 0, order = Order.ASC }: ReadingsFilterDTO,
  ): Promise<Reading[]> {
    this.logger.debug("Reading reading from InfluxDB:", rootHash);
    return Reading.findByRootHash(rootHash, {
      range: { start, stop },
      limit: { limit, offset },
      order,
    });
  }

  public async findManyReadingsByRootHash(
    rootHash: string[],
    { start, stop, limit = 100, offset = 0, order = Order.ASC }: ReadingsFilterDTO,
  ): Promise<Reading[][]> {
    this.logger.debug("Reading readings from InfluxDB:", rootHash);
    return Reading.findManyByRootHash(rootHash, {
      range: { start, stop },
      limit: { limit, offset },
      order,
    });
  }

  public async findRootHashes({
    assetDIDs,
    limit,
    offset,
    start,
    stop,
  }: ListingFilterDTO): Promise<string[]> {
    this.logger.debug("Reading available rootHashes for assetDIDs:", assetDIDs);
    return RootHash.find({
      assetDID: assetDIDs,
      limit: { limit, offset },
      range: { start, stop },
    });
  }

  public async findAssetDIDs({
    assetDIDs,
    limit,
    offset,
    start,
    stop,
  }: ListingFilterDTO): Promise<string[]> {
    this.logger.debug("Reading available rootHashes for assetDIDs:", assetDIDs);
    return AssetDID.find({
      assetDID: assetDIDs,
      limit: { limit, offset },
      range: { start, stop },
    });
  }
}
