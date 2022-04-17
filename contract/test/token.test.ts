import { expect } from "chai";
import { Contract, Signer } from "ethers";
import { ethers } from "hardhat";

describe("Token", function () {
  const initialAmount = 100;
  const contractName = "Token";
  let accounts: Signer[];
  let address: string;
  let address2: string;
  let token: Contract;

  before(async function () {
    accounts = await ethers.getSigners();
    expect(accounts.length).to.be.at.least(2);
    address = await accounts[0].getAddress();
    address2 = await accounts[1].getAddress();
  });

  beforeEach(async function () {
    const Token = await ethers.getContractFactory(contractName);
    token = await Token.deploy(initialAmount);
    await token.deployed();
  });

  it("set initial amount", async function () {
    expect(await token.balanceOf(address)).to.equal(initialAmount);
  });

  it("transfer function: success", async function () {
    const transferAmount = 10;
    const transferTx = await token.transfer(address2, transferAmount);
    await transferTx.wait();

    expect(await token.balanceOf(address2)).to.equal(transferAmount);
    expect(await token.balanceOf(address)).to.equal(
      initialAmount - transferAmount,
    );
  });

  it("transfer function: insufficient amount", async function () {
    const transferAmount = initialAmount + 1;

    await expect(token.transfer(address2, transferAmount)).to.be.revertedWith(
      "Not enough tokens",
    );

    expect(await token.balanceOf(address2)).to.equal(0);
    expect(await token.balanceOf(address)).to.equal(initialAmount);
  });
});
