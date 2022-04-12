import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { JsonRpcProvider } from "@ethersproject/providers";
import { utils, Wallet } from "ethers";
import { ReadingsNotary, ReadingsNotary__factory } from "./typechain";
import { Status, VOLTA_CHAIN } from "src/constants";
import { AggregatedReadings } from "src/readings/entities";

type NewReadingsArgs = [string, { hash: string; _isIndexed: boolean }];
@Injectable()
export class BlockchainService implements OnModuleInit {
  private readonly logger = new Logger(BlockchainService.name);
  private readonly wallet: Wallet;
  private readonly notary: ReadingsNotary;

  constructor() {
    const provider = new JsonRpcProvider(
      process.env.VOLTA_URL ?? "https://volta-rpc.energyweb.org",
      VOLTA_CHAIN,
    );
    this.wallet = utils.isValidMnemonic(process.env.SK)
      ? Wallet.fromMnemonic(process.env.SK).connect(provider)
      : new Wallet(process.env.SK, provider);

    this.notary = ReadingsNotary__factory.connect(
      process.env.READINGS_NOTARY_ADDRESS,
      this.wallet,
    );
  }

  onModuleInit() {
    this.checkReadingLogs();
    this.registerReadingLogListener();
  }

  signMessage(message: string) {
    return this.wallet.signMessage(message);
  }

  async getMeterReadingLog(rootHash: string) {
    const filter = this.notary.filters.NewMeterReading(undefined, rootHash);
    return await this.notary.queryFilter(filter);
  }

  private async registerReadingLogListener() {
    const filter = this.notary.filters.NewMeterReading();
    this.notary.on(filter, async (aggregator, hashedRootHash) => {
      this.logger.debug(`HashedRootHash ${hashedRootHash} by ${aggregator}`);
      await AggregatedReadings.update(
        { hashedRootHash, status: Status.Submitted },
        { status: Status.Confirmed },
      );
    });
  }

  private async checkReadingLogs() {
    const hashedRootHashes = (
      await AggregatedReadings.find({
        where: { status: Status.Submitted },
        select: ["rootHash"],
      })
    ).map((aggregated) => aggregated.rootHash);
    const filter = this.notary.filters.NewMeterReading(null, hashedRootHashes);
    const logs = await this.notary.queryFilter(filter);
    logs
      .map((log) => {
        const { args } = this.notary.interface.parseLog(log);
        const [aggregator, hashedRootHash] = args as NewReadingsArgs;
        return [aggregator, hashedRootHash.hash] as const;
      })
      .forEach(async ([aggregator, hashedRootHash]) => {
        this.logger.debug(`HashedRootHash ${hashedRootHash} by ${aggregator}`);
        await AggregatedReadings.update(
          { hashedRootHash, status: Status.Submitted },
          { status: Status.Confirmed },
        );
      });
  }
}
