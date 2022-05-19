import { InfluxdbService, ListingsQueryOptions } from "src/influxdb/influxdb.service";
import { InfluxDbRowDTO } from "../dto";

export class AssetDID {
  public static influxDBRepository: InfluxdbService;

  constructor(public readonly assetDID: string) {
    if (!AssetDID.influxDBRepository) throw new Error("InfluxDBRepository not set");
  }

  static async findOne(options: ListingsQueryOptions) {
    const db = this.influxDBRepository.dbReader;
    const query = this.influxDBRepository.listingQuery("assetDID", {
      ...options,
      limit: { limit: 1, offset: options.limit.offset },
    });
    const rows = await db.collectRows<InfluxDbRowDTO>(query);
    return rows.map((row) => row.assetDID).shift();
  }

  static async find(options: ListingsQueryOptions) {
    const db = this.influxDBRepository.dbReader;
    const query = this.influxDBRepository.listingQuery("assetDID", options);
    const rows = await db.collectRows<InfluxDbRowDTO>(query);
    return rows.map((row) => row.assetDID);
  }
}
