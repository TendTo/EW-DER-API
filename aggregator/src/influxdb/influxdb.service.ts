import { ClientOptions, InfluxDB } from "@influxdata/influxdb-client";
import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AggregationFunction, Order } from "../constants";

export type ListingsQueryOptions = {
  range?: {
    start: string;
    stop: string;
  };
  limit?: {
    limit: number;
    offset: number;
  };
};
export type ReadingsQueryOptions = ListingsQueryOptions & {
  aggregateWindow?: {
    every: string;
    fn: AggregationFunction;
  };
  getLast?: boolean;
  difference?: boolean;
  order?: Order;
  group?: string[];
};
export type AggregationQueryOptions = Omit<ReadingsQueryOptions, "getLast" | "group">;
type GetQueryOptionsFn<Options> = Options & {
  filterFn?: string;
  assetDID: never;
  rootHash: never;
};
type GetQueryOptionsAssetId<Options> = Options & {
  filterFn?: never;
  assetDID?: string | string[];
  rootHash?: never;
};
type GetQueryOptionsRootHash<Options> = Options & {
  filterFn?: never;
  assetDID?: never;
  rootHash?: string | string[];
};
type GetQueryOptions<Options> =
  | GetQueryOptionsFn<Options>
  | GetQueryOptionsAssetId<Options>
  | GetQueryOptionsRootHash<Options>;

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

  private buildFilterFn(field: "assetDID" | "rootHash", values: string | string[]) {
    const condition = Array.isArray(values)
      ? values.map((value) => `r.${field} == "${value}"`).join(" or ")
      : `r.${field} == "${values}"`;
    return `|> filter(fn: (r) => ${condition} and r._field == "reading")`;
  }

  private get fromClause() {
    return `from(bucket: "${this.bucket}")`;
  }

  public listingQuery(
    identifier: "assetDID" | "rootHash",
    { range, limit }: ListingsQueryOptions,
  ) {
    return `
    ${this.fromClause}
    ${range ? `|> range(start: ${range.start}, stop: ${range.stop})` : ""}
    |> sort(columns: ["_time"])
    |> group()
    |> keep(columns: ["${identifier}"])
    |> unique(column: "${identifier}")
    ${limit ? `|> limit(n: ${limit.limit}, offset: ${limit.offset})` : ""}
    `;
  }

  public readingsQuery({
    range,
    filterFn,
    getLast,
    limit,
    assetDID,
    rootHash,
    aggregateWindow,
    difference,
    order = Order.ASC,
    group,
  }: GetQueryOptions<ReadingsQueryOptions>) {
    return `
    ${this.fromClause}
    ${range ? `|> range(start: ${range.start}, stop: ${range.stop})` : ""}
    ${filterFn ? `|> filter(fn: ${filterFn})` : ""}
    ${assetDID ? this.buildFilterFn("assetDID", assetDID) : ""}
    ${rootHash ? this.buildFilterFn("rootHash", rootHash) : ""}
    ${getLast ? "|> last()" : ""}
    ${difference ? `|> difference()` : ""}
    ${
      aggregateWindow
        ? `|> aggregateWindow(every: ${aggregateWindow.every}, fn: ${aggregateWindow.fn}, createEmpty: false)`
        : ""
    }
    ${group && group.length > 0 ? `|> group(columns: ["${group.join('","')}"])` : ""}
    |> sort(columns: ["_time"], desc: ${order === Order.DESC ? "true" : "false"})
    ${limit ? `|> limit(n: ${limit.limit}, offset: ${limit.offset})` : ""}
    `;
  }

  public aggregationQuery({
    range,
    filterFn,
    limit,
    assetDID,
    rootHash,
    aggregateWindow,
    difference,
    order = Order.ASC,
  }: GetQueryOptions<AggregationQueryOptions>) {
    return `
    ${this.fromClause}
    ${range ? `|> range(start: ${range.start}, stop: ${range.stop})` : ""}
    ${filterFn ? `|> filter(fn: ${filterFn})` : ""}
    ${assetDID ? this.buildFilterFn("assetDID", assetDID) : ""}
    ${rootHash ? this.buildFilterFn("rootHash", rootHash) : ""}
    |> sort(columns: ["_time"], desc: ${order === Order.DESC ? "true" : "false"})
    |> group()
    ${
      aggregateWindow
        ? `|> aggregateWindow(every: ${aggregateWindow.every}, fn: ${aggregateWindow.fn}, createEmpty: false)`
        : ""
    }
    ${difference ? `|> difference()` : ""}
    ${limit ? `|> limit(n: ${limit.limit}, offset: ${limit.offset})` : ""}
    `;
  }
}
