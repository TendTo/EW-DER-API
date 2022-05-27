import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { InfluxdbService } from "src/influxdb/influxdb.service";
import { AssetFilterDTO } from "./dto";
import { Asset } from "./entities";

@Injectable()
export class AssetService implements OnModuleInit {
  private readonly logger = new Logger(AssetService.name);

  constructor(private readonly influxDbService: InfluxdbService) {}

  onModuleInit() {
    Asset.influxDBRepository = this.influxDbService;
  }

  find({
    aggregationFunction: fn,
    aggregationWindow: interval,
    compatibleValue,
  }: AssetFilterDTO) {
    this.logger.debug(`Reading assets from InfluxDB (fn: ${fn}, interval: ${interval}):`);
    return Asset.find({ fn, interval, compatibleValue });
  }
}
