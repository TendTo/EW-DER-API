import { Point } from "@influxdata/influxdb-client";
import { ReducedReadingDTO } from "src/aggregated-readings/dto/reducedReading.dto";
import {
  AggregationQueryOptions,
  InfluxdbService,
  ReadingsQueryOptions,
} from "src/influxdb/influxdb.service";
import { InfluxDbReadingDTO, ReadingDTO } from "../dto";

export class Reading {
  public static influxDBRepository: InfluxdbService;
  assetDID: string;
  value: number;
  timestamp: Date;
  rootHash: string;

  constructor(reading: ReadingDTO);
  constructor(reading: ReducedReadingDTO, rootHash: string);
  constructor(
    { assetDID, timestamp, value, rootHash: readingRootHash }: ReadingDTO,
    rootHash: string = "",
  ) {
    this.assetDID = assetDID;
    this.timestamp = timestamp;
    this.value = value;
    this.rootHash = readingRootHash || rootHash;
    if (!Reading.influxDBRepository) throw new Error("InfluxDBRepository not set");
  }

  private static rowToObject = ({
    assetDID,
    rootHash,
    _value,
    _time,
  }: InfluxDbReadingDTO) =>
    new Reading({ assetDID, rootHash, value: _value, timestamp: _time });

  static async saveMany(readings: Reading[]) {
    const points = readings.map((r) => this.buildPoint(r));
    const db = this.influxDBRepository.dbWriter;
    db.writePoints(points);
    await db.close();
  }

  async save() {
    const point = Reading.buildPoint(this);
    const db = Reading.influxDBRepository.dbWriter;
    db.writePoint(point);
    await db.close();
  }

  static async findOne(assetDID: string, options: ReadingsQueryOptions) {
    const query = this.influxDBRepository.readingsQuery({
      ...options,
      assetDID,
      limit: { limit: 1, offset: 0 },
      group: ["assetDID"],
    });
    return (await this.influxDBRepository.getRows(query, this.rowToObject)).shift();
  }

  static async find(assetDID: string, options: ReadingsQueryOptions) {
    const query = this.influxDBRepository.readingsQuery({
      ...options,
      group: ["assetDID"],
      assetDID,
    });
    return this.influxDBRepository.getRows(query, this.rowToObject);
  }

  static async findMany(assetDID: string[], options: ReadingsQueryOptions) {
    const query = this.influxDBRepository.readingsQuery({
      ...options,
      group: ["assetDID"],
      assetDID,
    });
    return this.influxDBRepository.getTables(query, this.rowToObject);
  }

  static async findLast(assetDID: string, start = "-1d") {
    const query = this.influxDBRepository.readingsQuery({
      group: ["assetDID"],
      assetDID: assetDID,
      range: { start, stop: "now()" },
      getLast: true,
    });
    return (await this.influxDBRepository.getRows(query, this.rowToObject)).shift();
  }

  static async findByRootHash(rootHash: string, options: ReadingsQueryOptions) {
    const query = this.influxDBRepository.readingsQuery({
      ...options,
      group: ["rootHash"],
      rootHash,
    });
    return this.influxDBRepository.getRows(query, this.rowToObject);
  }

  static async findManyByRootHash(rootHash: string[], options: ReadingsQueryOptions) {
    const query = this.influxDBRepository.readingsQuery({
      ...options,
      group: ["rootHash"],
      rootHash,
    });
    return this.influxDBRepository.getTables(query, this.rowToObject);
  }

  static async aggregate(assetDIDs: string[], options: AggregationQueryOptions) {
    const query = this.influxDBRepository.aggregationQuery({
      ...options,
      assetDID: assetDIDs,
    });
    return this.influxDBRepository.getRows(query, this.rowToObject);
  }

  static async aggregateByRootHash(
    assetDIDs: string[],
    options: AggregationQueryOptions,
  ) {
    const query = this.influxDBRepository.aggregationQuery({
      ...options,
      assetDID: assetDIDs,
    });
    return this.influxDBRepository.getRows(query, this.rowToObject);
  }

  private static buildPoint(reading: Reading) {
    return new Point("reading")
      .tag("assetDID", reading.assetDID)
      .tag("rootHash", reading.rootHash)
      .intField("reading", reading.value)
      .timestamp(new Date(reading.timestamp));
  }
}
