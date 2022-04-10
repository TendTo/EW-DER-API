import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { BlockchainService } from "src/blockchain/blockchain.service";
import { OnReadingsCreated, onReadingsCreatedId } from "../events";

@Injectable()
export class ReadingCreatedListener {
  private readonly logger = new Logger(ReadingCreatedListener.name);

  constructor(private readonly blockchainService: BlockchainService) {}

  @OnEvent(onReadingsCreatedId)
  async handleReadingCreatedEvent(event: OnReadingsCreated) {
    this.logger.debug("Creating new Readings");
    this.blockchainService.emitNewReadings(event.aggregated);
  }
}
