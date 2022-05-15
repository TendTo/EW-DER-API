import { NonceManager } from "@ethersproject/experimental";
import { JsonRpcProvider } from "@ethersproject/providers";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { utils, Wallet } from "ethers";
import { AggregatedReadingsDTO } from "src/aggregated-readings/dto";
import { Config, DID_REGEX, VOLTA_CHAIN } from "src/constants";
import { ReadingDTO } from "src/readings/dto";
import { getAddressFromDID } from "src/utility";
import {
  IdentityManager,
  IdentityManager__factory,
  ReadingsNotary,
  ReadingsNotary__factory,
} from "./typechain";

@Injectable()
export class BlockchainService {
  private readonly logger = new Logger(BlockchainService.name);
  private readonly wallet: Wallet;
  private readonly manager: NonceManager;
  private readonly identityManager: IdentityManager;
  private readonly notary: ReadingsNotary;

  constructor(private readonly configService: ConfigService) {
    const provider = new JsonRpcProvider(
      this.configService.get(Config.VOLTA_URL) ?? "https://volta-rpc.energyweb.org",
      VOLTA_CHAIN,
    );
    this.wallet = utils.isValidMnemonic(this.configService.get(Config.SK))
      ? Wallet.fromMnemonic(this.configService.get(Config.SK)).connect(provider)
      : new Wallet(this.configService.get(Config.SK), provider);
    this.manager = new NonceManager(this.wallet);

    this.identityManager = IdentityManager__factory.connect(
      this.configService.get(Config.IDENTITY_MANAGER_ADDRESS),
      this.wallet,
    );

    this.notary = ReadingsNotary__factory.connect(
      this.configService.get(Config.READINGS_NOTARY_ADDRESS),
      this.manager,
    );
  }

  get aggregatorAddress() {
    return this.wallet.address;
  }

  isDID(DID: string) {
    return new RegExp(DID_REGEX).test(DID);
  }

  isAddress(address: string) {
    return utils.isAddress(address);
  }

  getSignatureAddress(message: string, signature: string) {
    return utils.verifyMessage(message, signature);
  }

  getMeterReadingLog(rootHash: string) {
    const filter = this.notary.filters.NewMeterReading(undefined, rootHash);
    return this.notary.queryFilter(filter);
  }

  async isOwner(prosumer: string, readings: ReadingDTO[]): Promise<boolean>;
  async isOwner(prosumer: string, assetDID: string): Promise<boolean>;
  async isOwner(prosumer: string, DIDorReadings: string | ReadingDTO[]) {
    this.logger.debug(`Check whether ${prosumer} isOwner of ${DIDorReadings.length} assets`);
    if (typeof DIDorReadings === "string") {
      return this.isOwnerAssetDID(prosumer, DIDorReadings);
    }
    return this.isOwnerReadings(prosumer, DIDorReadings);
  }

  private async isOwnerAssetDID(prosumer: string, addetDID: string) {
    const addressDID = getAddressFromDID(addetDID);
    const owner = await this.identityManager.identityOwner(addressDID);
    return owner === prosumer;
  }

  private async isOwnerReadings(prosumer: string, readings: ReadingDTO[]) {
    const assetDIDs = readings
      .filter((assetDID, i, arr) => arr.indexOf(assetDID) === i)
      .map((reading) => getAddressFromDID(reading.assetDID));
    const owner = await Promise.all(
      assetDIDs.map(async (assetDID) => {
        const owner = await this.identityManager.identityOwner(assetDID);
        return owner === prosumer;
      }),
    );
    return owner.every((o) => o);
  }

  async emitNewReadings(readings: AggregatedReadingsDTO) {
    this.logger.debug(`Emit new readings ${readings.rootHash}`);
    await this.notary.functions.store(readings.rootHash);
  }
}
