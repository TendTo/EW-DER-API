import { JsonRpcProvider } from "@ethersproject/providers";
import { Injectable, Logger } from "@nestjs/common";
import { utils, Wallet } from "ethers";
import { AggregatedReadingsDTO } from "src/aggregated-readings/dto";
import { VOLTA_CHAIN } from "src/constants";
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
  private readonly identityManager: IdentityManager;
  private readonly notary: ReadingsNotary;

  constructor() {
    const provider = new JsonRpcProvider(
      process.env.VOLTA_URL ?? "https://volta-rpc.energyweb.org",
      VOLTA_CHAIN,
    );
    this.wallet = utils.isValidMnemonic(process.env.SK)
      ? Wallet.fromMnemonic(process.env.SK).connect(provider)
      : new Wallet(process.env.SK, provider);

    this.identityManager = IdentityManager__factory.connect(
      process.env.IDENTITY_MANAGER_ADDRESS,
      this.wallet,
    );

    this.notary = ReadingsNotary__factory.connect(
      process.env.READINGS_NOTARY_ADDRESS,
      this.wallet,
    );
  }

  getSignatureAddress(message: string, signature: string) {
    return utils.verifyMessage(message, signature);
  }

  async isOwner(prosumer: string, readings: ReadingDTO[]): Promise<boolean>;
  async isOwner(prosumer: string, assetDID: string): Promise<boolean>;
  async isOwner(prosumer: string, DIDorReadings: string | ReadingDTO[]) {
    this.logger.debug(`Check whether ${prosumer} isOwner of ${DIDorReadings}`);
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
