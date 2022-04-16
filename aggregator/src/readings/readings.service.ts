import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { InfluxdbService } from "src/influxdb/influxdb.service";
import { Order } from "../constants";
import { ReadingDTO, ReadingsFilterDTO } from "./dto";
import { Reading } from "./entities";

@Injectable()
export class ReadingsService implements OnModuleInit {
  private readonly logger = new Logger(ReadingsService.name);

  constructor(private readonly influxDbService: InfluxdbService) {}

  public async onModuleInit() {
    Reading.influxDBRepository = this.influxDbService;
  }

  public async storeReading(reading: ReadingDTO) {
    const newReading = new Reading(reading);
    await newReading.save();
    this.logger.debug("Writing reading to InfluxDB:", newReading);
  }

  public async findReading(
    assetDID: string,
    { start, stop }: ReadingsFilterDTO,
  ): Promise<Reading> {
    this.logger.debug("Reading reading from InfluxDB:", assetDID);
    return Reading.find(assetDID, { range: { start, stop } });
  }

  public async findReadings(
    assetDID: string,
    {
      start,
      stop,
      limit = 100,
      offset = 0,
      order = Order.ASC,
    }: ReadingsFilterDTO,
  ): Promise<Reading[]> {
    this.logger.debug("Reading readings from InfluxDB:", assetDID);
    return Reading.findMany(assetDID, {
      range: { start, stop },
      limit: { limit, offset },
      order,
    });
  }

  public async findLastReading(
    assetDID: string,
    start: string,
  ): Promise<Reading> {
    this.logger.debug(
      `Reading last reading from InfluxDB (start: ${start}):`,
      assetDID,
    );
    return Reading.findLast(assetDID, start);
  }

  public async findReadingsByRootHash(
    rootHash: string,
    {
      start,
      stop,
      limit = 100,
      offset = 0,
      order = Order.ASC,
    }: ReadingsFilterDTO,
  ): Promise<Reading[]> {
    this.logger.debug("Reading reading from InfluxDB:", rootHash);
    return Reading.findByRootHash(rootHash, {
      range: { start, stop },
      limit: { limit, offset },
      order,
    });
  }
}
