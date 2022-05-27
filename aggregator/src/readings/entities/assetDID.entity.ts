import { InfluxdbService, ListingsQueryOptions } from "src/influxdb/influxdb.service";
import { InfluxDbRowDTO } from "../dto";

export class AssetDID {
  public static influxDBRepository: InfluxdbService;

  constructor(public readonly assetDID: string) {
    if (!AssetDID.influxDBRepository) throw new Error("InfluxDBRepository not set");
  }

  private static rowToObject = (row: InfluxDbRowDTO) => new AssetDID(row.assetDID);
  private static rowToString = (row: InfluxDbRowDTO) => row.assetDID;

  static async findOne(options: ListingsQueryOptions) {
    const query = this.influxDBRepository.listingQuery("assetDID", {
      ...options,
      limit: { limit: 1, offset: options.limit.offset },
    });
    return (await this.influxDBRepository.getRows(query, this.rowToString)).shift();
  }

  static async find(options: ListingsQueryOptions) {
    const query = this.influxDBRepository.listingQuery("assetDID", options);
    return this.influxDBRepository.getRows(query, this.rowToString);
  }
}
