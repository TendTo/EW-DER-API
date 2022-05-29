import {
  InfluxdbService,
  ListingsQueryOptions,
  MatchQueryOptions,
} from "src/influxdb/influxdb.service";
import { InfluxDbRowDTO } from "src/utility";
import { AssetDTO, InfluxDbAssetDTO } from "../dto";

export class Asset {
  public static influxDBRepository: InfluxdbService;
  readonly assetDID: string;
  readonly value: number;

  constructor(reading: InfluxDbAssetDTO);
  constructor(reading: AssetDTO);
  constructor({ assetDID, ...rest }: AssetDTO | InfluxDbAssetDTO) {
    this.assetDID = assetDID;
    if ("value" in rest) this.value = rest.value;
    else this.value = rest._value;
    if (!Asset.influxDBRepository) throw new Error("InfluxDBRepository not set");
  }

  private static rowToObject = (row: InfluxDbAssetDTO) => new Asset(row);
  private static rowToString = (row: InfluxDbRowDTO) => row.assetDID;

  static async find(options: MatchQueryOptions): Promise<[Asset[], Asset[]]> {
    const query = this.influxDBRepository.matchingQuery(options);
    const assets = await this.influxDBRepository.getTables(
      query,
      this.rowToObject,
      ({ _value }) => (_value > 0 ? "positive" : "negative"),
    );
    if (assets.length === 2) return assets as [Asset[], Asset[]];
    else if (assets.length === 1)
      return assets[0][0].value < 0 ? [assets[0], []] : [[], assets[0]];
    return [[], []];
  }

  static async findOneDID(options: ListingsQueryOptions): Promise<string> {
    const query = this.influxDBRepository.listingQuery("assetDID", {
      ...options,
      limit: { limit: 1, offset: options.limit.offset },
    });
    return (await this.influxDBRepository.getRows(query, this.rowToString)).shift();
  }

  static async findDID(options: ListingsQueryOptions): Promise<string[]> {
    const query = this.influxDBRepository.listingQuery("assetDID", options);
    return this.influxDBRepository.getRows(query, this.rowToString);
  }
}
