import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from "@nestjs/common";
import {
  ReadingDTO,
  ReadingsFilterDTO,
  AggregatedReadDTO,
  MeasurementsDTO,
  AggregateFilterDTO,
} from "./dto";
import { ConfigService } from "@nestjs/config";
import { ClientOptions, InfluxDB, Point } from "@influxdata/influxdb-client";
import { AllowedDurationType, Unit } from "./constants";

@Injectable()
export class ReadingsService implements OnModuleInit {
  private readonly logger = new Logger(ReadingsService.name);

  private bucket: string;
  private organization: string;

  private config: ClientOptions;

  constructor(private readonly configService: ConfigService) {}

  public async onModuleInit() {
    const url = this.configService.get<string>("INFLUXDB_URL");
    const token = this.configService.get<string>("INFLUXDB_TOKEN");
    const organization = this.configService.get<string>("INFLUXDB_ORG") ?? "";
    const bucket = this.configService.get<string>("INFLUXDB_BUCKET");

    if (!url) throw new Error("Missing INFLUXDB_URL parameter");
    if (!token) throw new Error("Missing INFLUXDB_TOKEN parameter");
    if (!bucket) throw new Error("Missing INFLUXDB_BUCKET parameter");

    this.logger.debug(`Using InfluxDB instance on ${url}`);

    this.bucket = bucket;
    this.organization = organization;

    this.config = {
      url,
      token,
    };
  }

  public async store(assetDID: string, measurement: MeasurementsDTO) {
    const multiplier = this.getMultiplier(measurement.unit);
    const points = measurement.readings.map((r) =>
      new Point("reading")
        .tag("assetDID", assetDID)
        .intField("reading", r.value * multiplier)
        .timestamp(new Date(r.timestamp)),
    );

    const writer = this.dbWriter;
    this.logger.debug(`Writing points to InfluxDB: ${points}`);
    writer.writePoints(points);
    await writer.close();
  }

  public async aggregate(
    assetDID: string,
    filter: AggregateFilterDTO,
  ): Promise<AggregatedReadDTO[]> {
    try {
      const query = `
      from(bucket: "${this.bucket}")
      |> range(start: ${filter.start}, stop: ${filter.end})
      |> filter(fn: (r) => r.assetDID == "${assetDID}" and r._field == "reading")
      ${filter.difference ? "|> difference()" : ""}
      |> aggregateWindow(every: ${filter.window}, fn: ${filter.aggregate})
      `;

      return this.executeAggregated(query);
    } catch (e) {
      this.logger.error(e.message);
      throw e;
    }
  }

  public async find(
    massetDID: string,
    filter: ReadingsFilterDTO,
  ): Promise<ReadingDTO[]> {
    try {
      const query = this.findByMeterQuery(massetDID, filter);

      return this.execute(query);
    } catch (e) {
      this.logger.error(e.message);
      throw e;
    }
  }

  public async findLatestRead(
    assetDID: string,
    startDuration?: AllowedDurationType,
  ): Promise<ReadingDTO> {
    try {
      const query = this.findLatestReadByMeterQuery(assetDID, startDuration);

      const reads = await this.execute(query);
      if (reads.length === 0) {
        throw new NotFoundException(
          `Unable to get the latest reading. There are no readings yet for the asset ${assetDID}`,
        );
      }
      return reads[0];
    } catch (e) {
      this.logger.error(e.message);
      throw e;
    }
  }

  public async findDifference(
    assetDID: string,
    filter: ReadingsFilterDTO,
  ): Promise<ReadingDTO[]> {
    try {
      const query = `${this.findByMeterQuery(assetDID, filter)}
      |> difference()
      `;

      return this.execute(query);
    } catch (e) {
      this.logger.error(e.message);
      throw e;
    }
  }

  private findByMeterQuery(assetDID: string, filter: ReadingsFilterDTO): string {
    return `
    from(bucket: "${this.bucket}")
    |> range(start: ${filter.start}, stop: ${filter.end})
    |> limit(n: ${filter.limit}, offset: ${filter.offset})
    |> filter(fn: (r) => r.assetDID == "${assetDID}" and r._field == "reading")
    `;
  }

  public findLatestReadByMeterQuery(
    assetDID: string,
    startDuration?: AllowedDurationType,
  ): string {
    const start = startDuration ? `-${startDuration}` : "-1d";
    return `
    from(bucket: "${this.bucket}")
    |> range(start: ${start}, stop: now())
    |> filter(fn: (r) => r.assetDID == "${assetDID}" and r._field == "reading")
    |> last()
    `;
  }

  private async execute(query: string): Promise<ReadingDTO[]> {
    const data = await this.dbReader.collectRows<{
      _time: string;
      _value: string;
    }>(query);

    return data.map((record) => ({
      timestamp: new Date(record._time),
      value: Number(record._value),
    }));
  }

  private async executeAggregated(query: string): Promise<AggregatedReadDTO[]> {
    const data = await this.dbReader.collectRows<{
      _start: string;
      _stop: string;
      _value: string;
    }>(query);

    return data.map((record) => ({
      start: new Date(record._start),
      stop: new Date(record._stop),
      value: Number(record._value),
    }));
  }

  private get dbWriter() {
    return new InfluxDB(this.config).getWriteApi(
      this.organization,
      this.bucket,
    );
  }

  private get dbReader() {
    return new InfluxDB(this.config).getQueryApi(this.organization);
  }

  private getMultiplier(unit: Unit) {
    switch (unit) {
      case Unit.Wh:
        return 1;
      case Unit.kWh:
        return 10 ** 3;
      case Unit.MWh:
        return 10 ** 6;
      case Unit.GWh:
        return 10 ** 9;
    }
  }
}
