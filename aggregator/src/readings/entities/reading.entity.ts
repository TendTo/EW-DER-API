import { Point } from "@influxdata/influxdb-client";
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
  constructor(reading: ReadingDTO, rootHash: string);
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
    const db = this.influxDBRepository.dbReader;
    const query = this.influxDBRepository.readingsQuery({
      ...options,
      assetDID,
      limit: { limit: 1, offset: 0 },
      group: ["assetDID"],
    });
    const rows = await db.collectRows<InfluxDbReadingDTO>(query);
    return rows.map(this.rowMapper).find((r) => r.assetDID === assetDID);
  }

  static async find(assetDID: string, options: ReadingsQueryOptions) {
    const db = this.influxDBRepository.dbReader;
    const query = this.influxDBRepository.readingsQuery({
      ...options,
      group: ["assetDID"],
      assetDID,
    });
    const rows = await db.collectRows<InfluxDbReadingDTO>(query);
    return rows.map(this.rowMapper);
  }

  static async findMany(assetDID: string[], options: ReadingsQueryOptions) {
    const db = this.influxDBRepository.dbReader;
    const query = this.influxDBRepository.readingsQuery({
      ...options,
      group: ["assetDID"],
      assetDID,
    });
    const rows = await db.collectRows<InfluxDbReadingDTO>(query);
    return this.tablesToReadings(rows);
  }

  static async findLast(assetDID: string, start = "-1d") {
    const query = this.influxDBRepository.readingsQuery({
      group: ["assetDID"],
      assetDID: assetDID,
      range: { start, stop: "now()" },
      getLast: true,
    });
    const db = this.influxDBRepository.dbReader;
    const rows = await db.collectRows<InfluxDbReadingDTO>(query);
    const rest = rows.find((r) => r.assetDID === assetDID);
    return this.rowMapper(rest);
  }

  static async findByRootHash(rootHash: string, options: ReadingsQueryOptions) {
    const query = this.influxDBRepository.readingsQuery({
      ...options,
      group: ["rootHash"],
      rootHash,
    });
    const db = this.influxDBRepository.dbReader;
    const rows = await db.collectRows<InfluxDbReadingDTO>(query);
    return rows.map(this.rowMapper);
  }

  static async findManyByRootHash(rootHash: string[], options: ReadingsQueryOptions) {
    const query = this.influxDBRepository.readingsQuery({
      ...options,
      group: ["rootHash"],
      rootHash,
    });
    const db = this.influxDBRepository.dbReader;
    const rows = await db.collectRows<InfluxDbReadingDTO>(query);
    return this.tablesToReadings(rows);
  }

  static async aggregate(assetDIDs: string[], options: AggregationQueryOptions) {
    const db = this.influxDBRepository.dbReader;
    const query = this.influxDBRepository.aggregationQuery({
      ...options,
      assetDID: assetDIDs,
    });
    const rows = await db.collectRows<InfluxDbReadingDTO>(query);
    return rows.map(this.rowMapper);
  }

  static async aggregateByRootHash(
    assetDIDs: string[],
    options: AggregationQueryOptions,
  ) {
    const db = this.influxDBRepository.dbReader;
    const query = this.influxDBRepository.aggregationQuery({
      ...options,
      assetDID: assetDIDs,
    });
    const rows = await db.collectRows<InfluxDbReadingDTO>(query);
    return rows.map(this.rowMapper);
  }

  private static tablesToReadings(rows: InfluxDbReadingDTO[]): Reading[][] {
    const tables: Record<number, Reading[]> = rows.reduce((acc, row) => {
      const { table } = row;
      if (!acc[table]) {
        acc[table] = [];
      }
      acc[table].push(this.rowMapper(row));
      return acc;
    }, {});
    return Object.values(tables).map((readings) => readings);
  }

  private static rowMapper({
    assetDID,
    rootHash,
    _value,
    _time,
  }: InfluxDbReadingDTO): Reading {
    return new Reading({ assetDID, rootHash, value: _value, timestamp: _time });
  }

  private static buildPoint(reading: Reading) {
    return new Point("reading")
      .tag("assetDID", reading.assetDID)
      .tag("rootHash", reading.rootHash)
      .intField("reading", reading.value)
      .timestamp(new Date(reading.timestamp));
  }
}
