import { HttpService } from "@nestjs/axios";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { lastValueFrom, map } from "rxjs";
import { Config, Status } from "src/constants";
import { PreciseProofsService } from "src/precise-proofs/precise-proofs.service";
import { ReadingDTO } from "./dto";
import { AggregatedReadings, Reading } from "./entities";
import { OnReadingCreated, onReadingCreatedId } from "./events";

@Injectable()
export class ReadingsService {
  private readonly logger = new Logger(ReadingsService.name);
  private aggregatorUrl = "";

  constructor(
    private readonly preciseProof: PreciseProofsService,
    private readonly eventEmitter: EventEmitter2,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  public onModuleInit() {
    this.aggregatorUrl = this.configService.get<string>(Config.AGGREGATOR_URL);
    this.logger.debug("Aggregator url:", this.aggregatorUrl);
    if (this.aggregatorUrl === "") {
      throw new Error("Aggregator url not set");
    }
  }

  async create(readingDTO: ReadingDTO) {
    const newReading = new Reading(readingDTO);
    const res = await newReading.save();
    this.eventEmitter.emit(
      onReadingCreatedId,
      new OnReadingCreated(newReading),
    );
    this.logger.debug("New reading created: ", res);
    return res;
  }

  findAll() {
    return Reading.find();
  }

  findOne(id: number) {
    return Reading.find({ id });
  }

  remove(id: number) {
    return Reading.delete({ id });
  }

  countNotSubmitted() {
    return Reading.count({ where: { aggregatedReadings: null } });
  }

  async aggregateReadings() {
    const readingsToSubmit = await Reading.find({
      where: { aggregatedReadings: null },
    });

    const readingDTOs = readingsToSubmit.map((reading) => reading.dto);
    const preciseProof = this.preciseProof.generatePreciseProof(readingDTOs);

    const aggregatedReadings = new AggregatedReadings(
      preciseProof,
      readingsToSubmit,
      Status.Submitted,
    );
    this.logger.debug("Aggregated readings: ", aggregatedReadings.dto);
    this.logger.debug(`URL: ${this.aggregatorUrl}/readings`);
    const { data, status } = await lastValueFrom(
      this.httpService
        .post(`${this.aggregatorUrl}/readings`, aggregatedReadings.dto)
        .pipe(map((res) => ({ data: res.data, status: res.status }))),
    );
    this.logger.debug("Aggregated readings submitted: ", data);
  
    if (status !== 201) {
      aggregatedReadings.status = Status.Rejected;
      aggregatedReadings.readings = [];
      await aggregatedReadings.save();
      throw new Error("Aggregated readings submission failed");
    }

    await aggregatedReadings.save();
  }

  async changeAggregateStatus() {
    // TODO: implement the changeAggregateStatus method after the smart contract event
  }
}
