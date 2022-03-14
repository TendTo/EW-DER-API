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
    this.logger.debug(`Aggregator url: ${this.aggregatorUrl}`);
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

    const preciseProof =
      this.preciseProof.generatePreciseProof(readingsToSubmit);

    const aggregatedReadings = new AggregatedReadings(
      preciseProof,
      readingsToSubmit,
    );
    console.debug("Aggregated readings: ", aggregatedReadings);
    await aggregatedReadings.save();
    const { data, status } = await lastValueFrom(
      this.httpService
        .post(this.aggregatorUrl, aggregatedReadings)
        .pipe(map((res) => ({ data: res.data, status: res.status }))),
    );
    console.debug("Aggregated readings submitted: ", data);
    if (status !== 200) {
      throw new Error("Aggregated readings submission failed");
    }

    aggregatedReadings.status = Status.Accepted;
    await aggregatedReadings.save();
  }

  async changeAggregateStatus() {
    // TODO: implement the changeAggregateStatus method after the smart contract event
  }
}
