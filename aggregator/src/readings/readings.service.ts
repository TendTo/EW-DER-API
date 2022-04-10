import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { BlockchainService } from "src/blockchain/blockchain.service";
import { PreciseProofsService } from "src/precise-proofs/precise-proofs.service";
import { Order } from "../constants";
import { ReadingDTO, ReadingsFilterDTO } from "./dto";
import { InfluxDBRepository, Reading } from "./entities";

@Injectable()
export class ReadingsService implements OnModuleInit {
  private readonly logger = new Logger(ReadingsService.name);

  constructor(private readonly configService: ConfigService) {}

  public async onModuleInit() {
    const url = this.configService.get<string>("INFLUXDB_HOST");
    const token = this.configService.get<string>("INFLUXDB_TOKEN");
    const organization = this.configService.get<string>("INFLUXDB_ORG") ?? "";
    const bucket = this.configService.get<string>("INFLUXDB_BUCKET");

    if (!url) throw new Error("Missing INFLUXDB_HOST parameter");
    if (!token) throw new Error("Missing INFLUXDB_TOKEN parameter");
    if (!bucket) throw new Error("Missing INFLUXDB_BUCKET parameter");

    this.logger.debug(`Using InfluxDB instance on ${url}`);

    InfluxDBRepository.setDbConfig({
      bucket,
      organization,
      connection: { url, token },
    });
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
