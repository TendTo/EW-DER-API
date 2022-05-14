import { Point } from "@influxdata/influxdb-client";
import { GetQueryOptions, InfluxdbService } from "src/influxdb/influxdb.service";
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

  static async findOne(assetDID: string, options: GetQueryOptions) {
    const db = this.influxDBRepository.dbReader;
    const query = this.influxDBRepository.getQuery({
      ...options,
      assetDID,
      limit: { limit: 1, offset: 0 },
      group: ["assetDID"],
    });
    const rows = await db.collectRows<InfluxDbReadingDTO>(query);
    return rows.map(this.rowToReading).find((r) => r.assetDID === assetDID);
  }

  static async find(assetDID: string, options: GetQueryOptions) {
    const db = this.influxDBRepository.dbReader;
    const query = this.influxDBRepository.getQuery({
      ...options,
      group: ["assetDID"],
      assetDID,
    });
    const rows = await db.collectRows<InfluxDbReadingDTO>(query);
    return rows.map(this.rowToReading);
  }

  static async findMany(assetDID: string[], options: GetQueryOptions) {
    const db = this.influxDBRepository.dbReader;
    const query = this.influxDBRepository.getQuery({
      ...options,
      group: ["assetDID"],
      assetDID,
    });
    const rows = await db.collectRows<InfluxDbReadingDTO>(query);
    return this.tablesToReadings(rows);
  }

  static async findLast(assetDID: string, start = "-1d") {
    const query = this.influxDBRepository.getQuery({
      group: ["assetDID"],
      assetDID: assetDID,
      range: { start, stop: "now()" },
      getLast: true,
    });
    const db = this.influxDBRepository.dbReader;
    const rows = await db.collectRows<InfluxDbReadingDTO>(query);
    const rest = rows.find((r) => r.assetDID === assetDID);
    return this.rowToReading(rest);
  }

  static async findByRootHash(rootHash: string, options: GetQueryOptions) {
    const query = this.influxDBRepository.getQuery({
      ...options,
      group: ["rootHash"],
      rootHash,
    });
    const db = this.influxDBRepository.dbReader;
    const rows = await db.collectRows<InfluxDbReadingDTO>(query);
    return rows.map(this.rowToReading);
  }

  static async findManyByRootHash(rootHash: string[], options: GetQueryOptions) {
    const query = this.influxDBRepository.getQuery({
      ...options,
      group: ["rootHash"],
      rootHash,
    });
    console.log(query);
    const db = this.influxDBRepository.dbReader;
    const rows = await db.collectRows<InfluxDbReadingDTO>(query);
    return this.tablesToReadings(rows);
  }

  private static tablesToReadings(rows: InfluxDbReadingDTO[]): Reading[][] {
    const tables: Record<number, Reading[]> = rows.reduce((acc, row) => {
      const { table } = row;
      if (!acc[table]) {
        acc[table] = [];
      }
      acc[table].push(this.rowToReading(row));
      return acc;
    }, {});
    return Object.values(tables).map((readings) => readings);
  }

  private static rowToReading({
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
