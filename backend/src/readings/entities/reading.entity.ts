import { Point } from "@influxdata/influxdb-client";
import { InfluxDbReadingDTO, ReadingDTO } from "../dto";
import { GetQueryOptions, InfluxDBRepository } from "./influxDb.repository";

export class Reading {
  assetDID: string;
  value: number;
  timestamp: Date;

  constructor(
    { assetDID, timestamp, value }: ReadingDTO,
    public rootHash: string,
  ) {
    this.assetDID = assetDID;
    this.timestamp = timestamp;
    this.value = value;
  }

  static async saveMany(readings: Reading[]) {
    const points = readings.map((r) =>
      new Point("reading")
        .tag("assetDID", r.assetDID)
        .intField("reading", r.value)
        .timestamp(new Date(r.timestamp)),
    );
    const db = InfluxDBRepository.instance.dbWriter;
    db.writePoints(points);
    await db.close();
  }

  async save() {
    const point = new Point("reading")
      .tag("assetDID", this.assetDID)
      .intField("reading", this.value)
      .timestamp(new Date(this.timestamp));
    const db = InfluxDBRepository.instance.dbWriter;
    db.writePoint(point);
    await db.close();
  }

  static async find(assetDID: string, options: GetQueryOptions) {
    const db = InfluxDBRepository.instance.dbReader;
    const query = InfluxDBRepository.instance.getQuery({
      assetDID,
      ...options,
    });
    const rows = await db.collectRows<InfluxDbReadingDTO>(query);
    return rows
      .map(this.rowToReading)
      .map((r) => new this(r, ""))
      .find((r) => r.assetDID === assetDID);
  }

  static async findMany(assetDID: string, options: GetQueryOptions) {
    const db = InfluxDBRepository.instance.dbReader;
    const query = InfluxDBRepository.instance.getQuery({
      assetDID,
      ...options,
    });
    const rows = await db.collectRows<InfluxDbReadingDTO>(query);
    return rows.map(this.rowToReading).map((r) => new this(r, ""));
  }

  static async findLast(assetDID: string, start = "-1d") {
    const query = InfluxDBRepository.instance.getQuery({
      assetDID: assetDID,
      range: { start, stop: "now()" },
      getLast: true,
    });
    const db = InfluxDBRepository.instance.dbReader;
    const rows = await db.collectRows<InfluxDbReadingDTO>(query);
    const rest = rows
      .map(this.rowToReading)
      .map((r) => new this(r, ""))
      .find((r) => r.assetDID === assetDID);
    return rest;
  }

  private static rowToReading({
    assetDID,
    _value,
    _time,
  }: InfluxDbReadingDTO): ReadingDTO {
    return { assetDID, value: _value, timestamp: _time };
  }
}
