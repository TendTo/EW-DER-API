import { HttpService } from "@nestjs/axios";
import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { AxiosError } from "axios";
import { catchError, lastValueFrom, map } from "rxjs";
import { Config, Status } from "src/constants";
import { PreciseProofsService } from "src/precise-proofs/precise-proofs.service";
import { getConnection } from "typeorm";
import { ReadingDTO } from "./dto";
import { AggregatedReadings, Reading } from "./entities";
import {
  OnAggregatedReadingsCreated,
  onAggregatedReadingsId,
  OnReadingCreated,
  onReadingCreatedId,
} from "./events";

type AggregatedReadingsResponse = {
  status: number;
  message: string;
};
type AggregatedReadingsErrorResponse = {
  statusCode: number;
  message: string;
};

@Injectable()
export class ReadingsService implements OnModuleInit {
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
    this.eventEmitter.emit(onReadingCreatedId, new OnReadingCreated(newReading));
    this.logger.debug("New reading created: ", res);
    return res;
  }

  findAll() {
    return Reading.find();
  }

  findOne(id: number) {
    return Reading.findOne({ id });
  }

  remove(id: number) {
    return Reading.delete({ id });
  }

  countNotSubmitted() {
    return Reading.count({ where: { aggregatedReadings: null } });
  }

  async aggregateReadings() {
    getConnection().transaction(async (manager) => {
      const readingsToSubmit = await manager.find(Reading, {
        where: { aggregatedReadings: null },
      });

      const readingDTOs = readingsToSubmit.map((reading) => reading.dto);
      const preciseProof = await this.preciseProof.generatePreciseProof(readingDTOs);

      const aggregatedReadings = new AggregatedReadings(
        preciseProof,
        readingsToSubmit,
        Status.NotSubmitted,
      );
      await manager.save(aggregatedReadings);
      this.eventEmitter.emit(
        onAggregatedReadingsId,
        new OnAggregatedReadingsCreated(aggregatedReadings),
      );
    });
  }

  async sendAggregateReadings(rootHash: string) {
    const aggregatedReadings = await AggregatedReadings.findOne({
      where: { status: Status.NotSubmitted, rootHash },
      relations: ["readings"],
    });
    if (!aggregatedReadings) return;
    aggregatedReadings.status = Status.Submitted;
    const { status, message }: AggregatedReadingsResponse = await lastValueFrom(
      this.httpService
        .post(`${this.aggregatorUrl}/aggregated-readings`, aggregatedReadings.dto)
        .pipe(
          map((res) => ({ status: res.status, message: res.statusText })),
          catchError(async (err: AxiosError<AggregatedReadingsErrorResponse>) => {
            aggregatedReadings.status = Status.Rejected;
            try {
              return { status: err.response.status, message: err.response.data.message };
            } catch {
              return { status: 500, message: err.message };
            }
          }),
        ),
    );

    if (status !== 201) {
      aggregatedReadings.status = Status.Rejected;
      this.logger.warn(`Aggregated readings rejected: ${message}`);
    } else {
      aggregatedReadings.status = Status.Confirmed;
      this.logger.debug(`Aggregated readings submitted: ${rootHash}`);
    }
    await aggregatedReadings.save();
  }

  findAllAggregatedReadings() {
    return AggregatedReadings.find();
  }

  async changeAggregateStatus() {
    // TODO: implement the changeAggregateStatus method after the smart contract event
  }
}
