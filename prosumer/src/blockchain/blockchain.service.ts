import { Injectable, OnModuleInit } from "@nestjs/common";
import { JsonRpcProvider } from "@ethersproject/providers";
import { utils, Wallet } from "ethers";
import { ReadingsNotary, ReadingsNotary__factory } from "./typechain";
import { Status, VOLTA_CHAIN } from "src/constants";
import { AggregatedReadings } from "src/readings/entities";
import { Logger } from "ethers/lib/utils";
@Injectable()
export class BlockchainService implements OnModuleInit {
  private logger = new Logger(BlockchainService.name);
  private wallet: Wallet;
  private notary: ReadingsNotary;

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

  // TODO: this should bootstrap the blockchain
  onModuleInit() {
    this.checkReadingLogs();
    this.registerReadingLogListener();
  }

  async getMeterReadingLog(rootHash: string) {
    const filter = this.notary.filters.NewMeterReading(undefined, rootHash);
    return await this.notary.queryFilter(filter);
  }

  private async registerReadingLogListener() {
    const filter = this.notary.filters.NewMeterReading();
    this.notary.on(filter, async (aggregator, rootHash) => {
      this.logger.debug(
        `Captured event with rootHash ${rootHash} by aggregator ${aggregator}`,
      );
      const aggregated = await AggregatedReadings.findOne({
        where: { rootHash },
      });
      if (!aggregated) {
        return;
      }
      aggregated.status = Status.Confirmed;
      await aggregated.save();
    });
  }

  private async checkReadingLogs() {
    const filter = this.notary.filters.NewMeterReading();
    const logs = await this.notary.queryFilter(filter);
    logs.forEach(({ args }) => {
      this.logger.debug(
        `Captured event with rootHash ${args.proof} by aggregator ${args.operator}`,
      );
    });
  }
}
