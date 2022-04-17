import { ClientOptions, InfluxDB } from "@influxdata/influxdb-client";
import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AggregationFunction, Order } from "../constants";

export type GetQueryOptions = {
  range?: {
    start: string;
    stop: string;
  };
  limit?: {
    limit: number;
    offset: number;
  };
  aggregateWindow?: {
    every: string;
    fn: AggregationFunction;
  };
  getLast?: boolean;
  difference?: boolean;
  order?: Order;
  group?: string[];
};

export type GetQueryOptionsFn = GetQueryOptions & {
  filterFn?: string;
  assetDID: never;
  rootHash: never;
};

export type GetQueryOptionsAssetId = GetQueryOptions & {
  filterFn?: never;
  assetDID?: string;
  rootHash?: never;
};

export type GetQueryOptionsRootHash = GetQueryOptions & {
  filterFn?: never;
  assetDID?: never;
  rootHash?: string;
};

@Injectable()
export class InfluxdbService implements OnModuleInit {
  private readonly logger = new Logger(InfluxdbService.name);
  private connectionConfig: ClientOptions;
  private organization: string;
  private bucket: string;

  public get dbWriter() {
    return new InfluxDB(this.connectionConfig).getWriteApi(
      this.organization,
      this.bucket,
    );
  }

  public get dbReader() {
    return new InfluxDB(this.connectionConfig).getQueryApi(this.organization);
  }

  constructor(private readonly configService: ConfigService) {}

  public async onModuleInit() {
    const url = this.configService.get<string>("INFLUXDB_HOST");
    const token = this.configService.get<string>("INFLUXDB_TOKEN");
    this.organization = this.configService.get<string>("INFLUXDB_ORG") ?? "";
    this.bucket = this.configService.get<string>("INFLUXDB_BUCKET");

    if (!url) throw new Error("Missing INFLUXDB_HOST parameter");
    if (!token) throw new Error("Missing INFLUXDB_TOKEN parameter");
    if (!this.organization) throw new Error("Missing INFLUXDB_ORG parameter");
    if (!this.bucket) throw new Error("Missing INFLUXDB_BUCKET parameter");

    this.connectionConfig = { url, token };
    this.logger.debug(`Using InfluxDB instance on ${url}`);
  }

  public getQuery({
    range,
    filterFn,
    getLast,
    limit,
    assetDID,
    rootHash,
    aggregateWindow,
    difference,
    order: sort,
    group,
  }: GetQueryOptionsAssetId | GetQueryOptionsFn | GetQueryOptionsRootHash) {
    return `
    from(bucket: "${this.bucket}")
    ${range ? `|> range(start: ${range.start}, stop: ${range.stop})` : ""}
    ${filterFn ? `|> filter(fn: ${filterFn})` : ""}
    ${
      assetDID
        ? `|> filter(fn: (r) => r.assetDID == "${assetDID}" and r._field == "reading")`
        : ""
    }
    ${
      rootHash
        ? `|> filter(fn: (r) => r.rootHash == "${rootHash}" and r._field == "reading")`
        : ""
    }
    ${getLast ? "|> last()" : ""}
    ${difference ? `|> difference()` : ""}
    ${
      aggregateWindow
        ? `|> aggregateWindow(every: ${aggregateWindow.every}, fn: ${aggregateWindow.fn}, createEmpty: false)`
        : ""
    }
    ${
      group && group.length > 0
        ? `|> group(columns: ["${group.join('","')}"])`
        : ""
    }
    ${
      sort && sort === Order.DESC
        ? `|> sort(columns: ["_time"], desc: true)`
        : ""
    }
    ${limit ? `|> limit(n: ${limit.limit}, offset: ${limit.offset})` : ""}
    `;
  }
}
