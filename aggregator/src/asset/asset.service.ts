import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { InfluxdbService } from "src/influxdb/influxdb.service";
import { AssetFilterDTO, AssetMatchFilterDTO, AssetsFilterDTO } from "./dto";
import { Asset, RootHash } from "./entities";

@Injectable()
export class AssetService implements OnModuleInit {
  private readonly logger = new Logger(AssetService.name);

  constructor(private readonly influxDbService: InfluxdbService) {}

  onModuleInit() {
    Asset.influxDBRepository = this.influxDbService;
    RootHash.influxDBRepository = this.influxDbService;
  }

  find({
    aggregationFunction: fn,
    aggregationWindow: interval,
    compatibleValue,
  }: AssetMatchFilterDTO): Promise<Asset[][]> {
    this.logger.debug(`Reading assets from InfluxDB (fn: ${fn}, interval: ${interval}):`);
    return Asset.find({ fn, interval, compatibleValue });
  }

  public async findRootHashes({
    assetDIDs,
    limit,
    offset,
    start,
    stop,
  }: AssetFilterDTO): Promise<string[]> {
    this.logger.debug("Reading available rootHashes for assetDIDs:", assetDIDs);
    return RootHash.find({
      assetDID: assetDIDs,
      limit: { limit, offset },
      range: { start, stop },
    });
  }

  public async findAssetDIDs({
    assetDIDs,
    limit,
    offset,
    start,
    stop,
  }: AssetFilterDTO): Promise<string[]> {
    this.logger.debug("Reading available assetDIDs:", assetDIDs);
    return Asset.findDID({
      assetDID: assetDIDs,
      limit: { limit, offset },
      range: { start, stop },
    });
  }

  public async findAllAssetDIDs({
    limit,
    offset,
    start,
    stop,
  }: AssetsFilterDTO): Promise<string[]> {
    this.logger.debug("Reading all available assetDIDs");
    return Asset.findDID({
      limit: { limit, offset },
      range: { start, stop },
    });
  }
}
