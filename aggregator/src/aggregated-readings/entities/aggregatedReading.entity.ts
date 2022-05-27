import { AggregationQueryOptions, InfluxdbService } from "src/influxdb/influxdb.service";
import { AggregatedReadingDTO, InfluxDbAggregatedReadingDTO } from "../dto";

export class AggregatedReading {
  public static influxDBRepository: InfluxdbService;
  assetDID?: string;
  rootHash?: string;
  value: number;
  timestamp: Date;
  start: Date;
  stop: Date;

  constructor(reading: InfluxDbAggregatedReadingDTO);
  constructor(reading: AggregatedReadingDTO);
  constructor({
    assetDID,
    rootHash,
    ...rest
  }: AggregatedReadingDTO | InfluxDbAggregatedReadingDTO) {
    this.assetDID = assetDID;
    this.rootHash = rootHash;
    if ("value" in rest) {
      const { start, stop, timestamp, value } = rest;
      this.start = start;
      this.stop = stop;
      this.timestamp = timestamp;
      this.value = value;
    } else {
      const { _start, _stop, _time, _value } = rest;
      this.start = _start;
      this.stop = _stop;
      this.timestamp = _time;
      this.value = _value;
    }
    if (!AggregatedReading.influxDBRepository)
      throw new Error("InfluxDBRepository not set");
  }

  private static rowToObject = (row: InfluxDbAggregatedReadingDTO) =>
    new AggregatedReading(row);

  static async find(assetDID: string[], options: AggregationQueryOptions) {
    const query = this.influxDBRepository.aggregationQuery({
      ...options,
      assetDID,
    });
    return this.influxDBRepository.getRows(query, this.rowToObject);
  }

  static async findByRootHash(rootHash: string[], options: AggregationQueryOptions) {
    const query = this.influxDBRepository.aggregationQuery({
      ...options,
      rootHash,
    });
    return this.influxDBRepository.getRows(query, this.rowToObject);
  }
}
