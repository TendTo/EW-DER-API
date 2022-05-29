import { ClientOptions, InfluxDB, ParameterizedQuery } from "@influxdata/influxdb-client";
import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AggregationFunction, Order } from "../constants";

export type BaseQueryOptions = {
  range?: {
    start: string;
    stop: string;
  };
  limit?: {
    limit: number;
    offset: number;
  };
};
export type MatchQueryOptions = {
  interval: string;
  fn: AggregationFunction;
  compatibleValue?: number;
};
export type ListingsQueryOptions = BaseQueryOptions & {
  assetDID?: string | string[];
};
export type ReadingsQueryOptions = BaseQueryOptions & {
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

  public getRows<R extends Record<string, any>>(
    query: string | ParameterizedQuery,
  ): Promise<R[]>;
  public getRows<R extends Record<string, any>, O extends Object>(
    query: string | ParameterizedQuery,
    factory: (row: R) => O,
  ): Promise<O[]>;
  public getRows<R extends Record<string, any>, O extends Object>(
    query: string | ParameterizedQuery,
    factory?: (row: R) => O,
  ) {
    return new Promise<(R | O)[]>((resolve, reject) => {
      const rows: (R | O)[] = [];
      this.dbReader.queryRows(query, {
        next: (row, tableMeta) => {
          const obj = tableMeta.toObject(row) as R;
          rows.push(factory ? factory(obj) : obj);
        },
        error: (error) => {
          reject(error);
        },
        complete: () => {
          resolve(rows);
        },
      });
    });
  }

  public getTables<R extends Record<string, any>>(
    query: string | ParameterizedQuery,
    factory?: undefined,
    filter?: (row: R) => string,
  ): Promise<R[][]>;
  public getTables<R extends Record<string, any>, O extends Object>(
    query: string | ParameterizedQuery,
    factory: (row: R) => O,
    filter?: (row: R) => string,
  ): Promise<O[][]>;
  public getTables<R extends Record<string, any>, O extends Object>(
    query: string | ParameterizedQuery,
    factory?: (row: R) => O,
    filter?: (row: R) => string,
  ) {
    return new Promise<(R | O)[][]>((resolve, reject) => {
      const tables: Record<string | number, (R | O)[]> = {};
      this.dbReader.queryRows(query, {
        next: (row, tableMeta) => {
          const obj = tableMeta.toObject(row) as R;
          const key = filter ? filter(obj) : "table" in obj ? String(obj.table) : "-1";
          if (!Array.isArray(tables[key])) tables[key] = [];
          tables[key].push(factory ? factory(obj) : obj);
        },
        error: (error) => {
          reject(error);
        },
        complete: () => {
          resolve(Object.values(tables));
        },
      });
    });
  }

  private buildFilterFn(field: "assetDID" | "rootHash", values: string | string[]) {
    const condition = Array.isArray(values)
      ? values.map((value) => `r.${field} == "${value}"`).join(" or ")
      : `r.${field} == "${values}"`;
    return `|> filter(fn: (r) => ${condition} and r._field == "reading")`;
  }

  private buildFilterFromValue(value: number) {
    const filter =
      value > 0
        ? `r["_value"] > ${-value} and r["_value"] < 0`
        : `r["_value"] > ${-value}`;
    return `|> filter(fn: (r) => ${filter})`;
  }

  private get fromClause() {
    return `from(bucket: "${this.bucket}")`;
  }

  public matchingQuery({ interval, fn, compatibleValue }: MatchQueryOptions) {
    return `
    ${this.fromClause}
    |> range(start: -${interval}, stop: now())
    |> group(columns: ["assetDID"])
    |> aggregateWindow(every: ${interval}, fn: ${fn}, createEmpty: false)
    |> keep(columns: ["assetDID", "_value"])
    ${compatibleValue ? this.buildFilterFromValue(compatibleValue) : ""}
    |> unique(column: "assetDID")
    |> sort(columns: ["_value"])
    `;
  }

  public listingQuery(
    identifier: "assetDID" | "rootHash",
    { assetDID, range, limit }: ListingsQueryOptions,
  ) {
    return `
    ${this.fromClause}
    ${range ? `|> range(start: ${range.start}, stop: ${range.stop})` : ""}
    ${assetDID ? this.buildFilterFn("assetDID", assetDID) : ""}
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
    ${assetDID ? '|> group(columns: ["assetDID"])' : ""}
    ${rootHash ? '|> group(columns: ["rootHash"])' : ""}
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
