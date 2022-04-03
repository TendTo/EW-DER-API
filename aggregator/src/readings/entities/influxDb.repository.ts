import { ClientOptions, InfluxDB } from "@influxdata/influxdb-client";
import { AggregationFunction, Order } from "../../constants";

type InfluxDbConfig = {
  connection: ClientOptions;
  bucket: string;
  organization: string;
};

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

export class InfluxDBRepository {
  private static _instance: InfluxDBRepository;
  private _connectionConfig: ClientOptions;
  private _organization: string;
  private _bucket: string;

  public static get instance() {
    if (!this._instance)
      throw new Error("InfluxDBRepository is not initialized");
    return this._instance;
  }

  public get dbWriter() {
    return new InfluxDB(this._connectionConfig).getWriteApi(
      this._organization,
      this._bucket,
    );
  }

  public get dbReader() {
    return new InfluxDB(this._connectionConfig).getQueryApi(this._organization);
  }

  private constructor({ bucket, connection, organization }: InfluxDbConfig) {
    this._connectionConfig = connection;
    this._bucket = bucket;
    this._organization = organization;
  }

  public static setDbConfig(config: InfluxDbConfig) {
    this._instance = new this(config);
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
  }: GetQueryOptionsAssetId | GetQueryOptionsFn | GetQueryOptionsRootHash) {
    return `
    from(bucket: "${this._bucket}")
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
      sort && sort === Order.DESC
        ? `|> sort(columns: ["_time"], desc: true)`
        : ""
    }
    ${limit ? `|> limit(n: ${limit.limit}, offset: ${limit.offset})` : ""}
    `;
  }
}
