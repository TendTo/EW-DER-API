import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { OnEvent } from "@nestjs/event-emitter";
import { BlockchainService } from "src/blockchain/blockchain.service";
import { Config } from "src/constants";
import { OnReadingCreated, onReadingCreatedId } from "../events";
import { ReadingsService } from "../readings.service";

@Injectable()
export class ReadingCreatedListener {
  private readonly logger = new Logger(ReadingCreatedListener.name);
  private aggregationThreshold: number;

  constructor(
    private readonly configService: ConfigService,
    private readonly readingsService: ReadingsService,
    private readonly blockchainService: BlockchainService,
  ) {}

  public async onModuleInit() {
    this.aggregationThreshold = this.configService.get<number>(
      Config.AGGREGATION_THRESHOLD,
    );
    this.logger.debug("Aggregation threshold:", this.aggregationThreshold);
  }

  @OnEvent(onReadingCreatedId)
  async handleReadingCreatedEvent(event: OnReadingCreated) {
    const nNotSubmitted = await this.readingsService.countNotSubmitted();

    if (nNotSubmitted >= this.aggregationThreshold) {
      this.logger.debug("Aggregating readings");
      this.readingsService.aggregateReadings();
    }
  }
}
