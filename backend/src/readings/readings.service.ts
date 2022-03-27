import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  OnModuleInit,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PreciseProofsService } from "src/precise-proofs/precise-proofs.service";
import { AllowedDurationType } from "../constants";
import {
  AggregatedReadingsDTO,
  AggregateFilterDTO,
  ReadingDTO,
  ReadingsFilterDTO,
} from "./dto";
import { InfluxDBRepository, Reading } from "./entities";

@Injectable()
export class ReadingsService implements OnModuleInit {
  private readonly logger = new Logger(ReadingsService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly preciseProofsService: PreciseProofsService,
  ) {}

  public async onModuleInit() {
    const url = this.configService.get<string>("INFLUXDB_HOST");
    const token = this.configService.get<string>("INFLUXDB_TOKEN");
    const organization = this.configService.get<string>("INFLUXDB_ORG") ?? "";
    const bucket = this.configService.get<string>("INFLUXDB_BUCKET");

    if (!url) throw new Error("Missing INFLUXDB_HOST parameter");
    if (!token) throw new Error("Missing INFLUXDB_TOKEN parameter");
    if (!bucket) throw new Error("Missing INFLUXDB_BUCKET parameter");

    this.logger.debug(`Using InfluxDB instance on ${url}`);

    InfluxDBRepository.setDbConfig({
      bucket,
      organization,
      connection: { url, token },
    });
  }

  public async storeAggregateReadings(aggregated: AggregatedReadingsDTO) {
    if (!this.preciseProofsService.validateAggregatedReadings(aggregated)) {
      throw new HttpException(
        "Invalid aggregated readings: root hash did not match",
        HttpStatus.BAD_REQUEST,
      );
    }

    const readings = aggregated.readings.map(
      (reading) => new Reading(reading, ""),
    );
    await Reading.saveMany(readings);
    this.logger.debug(
      `Writing ${readings.length} readings to InfluxDB`,
      readings,
    );
  }

  public async storeReading(reading: ReadingDTO) {
    const newReading = new Reading(reading, "");
    await newReading.save();
    this.logger.debug("Writing reading to InfluxDB:", newReading);
  }

  public async findReading(
    assetDID: string,
    { start, stop }: ReadingsFilterDTO,
  ): Promise<Reading> {
    this.logger.debug("Reading reading from InfluxDB:", assetDID);
    return Reading.find(assetDID, { range: { start, stop } });
  }

  public async findReadings(
    assetDID: string,
    { start, stop, limit = 100, offset = 0 }: ReadingsFilterDTO,
  ): Promise<Reading[]> {
    this.logger.debug("Reading readings from InfluxDB:", assetDID);
    return Reading.findMany(assetDID, {
      range: { start, stop },
      limit: { limit, offset },
    });
  }

  public async findLastReading(
    assetDID: string,
    start: AllowedDurationType,
  ): Promise<Reading> {
    this.logger.debug(
      `Reading last reading from InfluxDB (start: ${start}):`,
      assetDID,
    );
    return Reading.findLast(assetDID, start);
  }
}
