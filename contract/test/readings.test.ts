import { expect } from "chai";
import { Signer } from "ethers";
import { ethers } from "hardhat";
import { ReadingsNotary as ReadingsNotaryType } from "../typechain";

describe("Token", function () {
  const readingNotaryName = "ReadingsNotary";
  const rootHash =
    "0x48f604b36ef74ccc9bed54bc7a373158e0f6641bc951dc7a8cd58deda785e8fb";
  let accounts: Signer[];
  let address: string;
  let notary: ReadingsNotaryType;

  before(async function () {
    accounts = await ethers.getSigners();
    address = await accounts[0].getAddress();
  });

  beforeEach(async function () {
    const ReadingsNotary = await ethers.getContractFactory(readingNotaryName);
    notary = (await ReadingsNotary.deploy()) as ReadingsNotaryType;
    await notary.deployed();
  });

  it("emit new metered reading by address", async function () {
    // const proof = utils.toUtf8Bytes(rootHash);
    await notary.store(rootHash);

    const filter = notary.filters.NewMeterReading(address);
    const logs = await notary.queryFilter(filter);

    expect(logs.length).to.equal(1);
    expect(logs[0].args.operator).to.equal(address);
  });

  it("emit new metered reading by proof", async function () {
    // const proof = utils.toUtf8Bytes(rootHash);
    await notary.store(rootHash);

    const filter = notary.filters.NewMeterReading(null, rootHash);
    const logs = await notary.queryFilter(filter);

    expect(logs.length).to.equal(1);
    expect(logs[0].args.operator).to.equal(address);
  });

  it("emit new metered reading by wrong proof", async function () {
    // const proof = utils.toUtf8Bytes(rootHash);
    await notary.store(rootHash);

    const filter = notary.filters.NewMeterReading(null, rootHash + "01");
    const logs = await notary.queryFilter(filter);

    expect(logs.length).to.equal(0);
  });
});
