import { InfluxdbService, ListingsQueryOptions } from "src/influxdb/influxdb.service";
import { InfluxDbRowDTO } from "../dto";

export class RootHash {
  public static influxDBRepository: InfluxdbService;

  constructor(public readonly rootHash: string) {
    if (!RootHash.influxDBRepository) throw new Error("InfluxDBRepository not set");
  }

  private static rowToObject = (row: InfluxDbRowDTO) => new RootHash(row.rootHash);
  private static rowToString = (row: InfluxDbRowDTO) => row.rootHash;

  static async findOne(options: ListingsQueryOptions) {
    const query = this.influxDBRepository.listingQuery("rootHash", {
      ...options,
      limit: { limit: 1, offset: options?.limit?.offset },
    });
    return (await this.influxDBRepository.getRows(query, this.rowToString)).shift();
  }

  static async find(options: ListingsQueryOptions) {
    const query = this.influxDBRepository.listingQuery("rootHash", options);
    return this.influxDBRepository.getRows(query, this.rowToString);
  }
}
