import { Point } from "@influxdata/influxdb-client";
import { InfluxDbReadingDTO, ReadingDTO } from "../dto";
import { GetQueryOptions, InfluxDBRepository } from "./influxDb.repository";

export class Reading {
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
  }

  static async saveMany(readings: Reading[]) {
    const points = readings.map((r) => this.buildPoint(r));
    const db = InfluxDBRepository.instance.dbWriter;
    db.writePoints(points);
    await db.close();
  }

  async save() {
    const point = Reading.buildPoint(this);
    const db = InfluxDBRepository.instance.dbWriter;
    db.writePoint(point);
    await db.close();
  }

  static async find(assetDID: string, options: GetQueryOptions) {
    const db = InfluxDBRepository.instance.dbReader;
    const query = InfluxDBRepository.instance.getQuery({
      ...options,
      assetDID,
      limit: { limit: 1, offset: 0 },
      group: [assetDID],
    });
    const rows = await db.collectRows<InfluxDbReadingDTO>(query);
    return rows.map(this.rowToReading).find((r) => r.assetDID === assetDID);
  }

  static async findMany(assetDID: string, options: GetQueryOptions) {
    const db = InfluxDBRepository.instance.dbReader;
    const query = InfluxDBRepository.instance.getQuery({
      ...options,
      group: [assetDID],
      assetDID,
    });
    const rows = await db.collectRows<InfluxDbReadingDTO>(query);
    return rows.map(this.rowToReading);
  }

  static async findLast(assetDID: string, start = "-1d") {
    const query = InfluxDBRepository.instance.getQuery({
      group: [assetDID],
      assetDID: assetDID,
      range: { start, stop: "now()" },
      getLast: true,
    });
    const db = InfluxDBRepository.instance.dbReader;
    const rows = await db.collectRows<InfluxDbReadingDTO>(query);
    const rest = rows
      .map(this.rowToReading)
      .find((r) => r.assetDID === assetDID);
    return rest;
  }

  static async findByRootHash(rootHash: string, options: GetQueryOptions) {
    const query = InfluxDBRepository.instance.getQuery({
      ...options,
      group: [rootHash],
      rootHash,
    });
    const db = InfluxDBRepository.instance.dbReader;
    const rows = await db.collectRows<InfluxDbReadingDTO>(query);
    return rows.map(this.rowToReading);
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
