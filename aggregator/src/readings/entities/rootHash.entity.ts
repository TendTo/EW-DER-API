import { InfluxdbService, ListingsQueryOptions } from "src/influxdb/influxdb.service";
import { InfluxDbRowDTO } from "../dto";

export class RootHash {
  public static influxDBRepository: InfluxdbService;

  constructor(public readonly rootHash: string) {
    if (!RootHash.influxDBRepository) throw new Error("InfluxDBRepository not set");
  }

  static async findOne(options: ListingsQueryOptions) {
    const db = this.influxDBRepository.dbReader;
    const query = this.influxDBRepository.listingQuery("rootHash", {
      ...options,
      limit: { limit: 1, offset: options?.limit?.offset },
    });
    const rows = await db.collectRows<InfluxDbRowDTO>(query);
    return rows.map((row) => row.rootHash).shift();
  }

  static async find(options: ListingsQueryOptions) {
    const db = this.influxDBRepository.dbReader;
    const query = this.influxDBRepository.listingQuery("rootHash", options);
    const rows = await db.collectRows<InfluxDbRowDTO>(query);
    return rows.map((row) => row.rootHash);
  }
}
