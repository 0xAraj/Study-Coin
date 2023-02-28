const Study = artifacts.require("Study.sol");
const { expectRevert, expectEvent } = require("@openzeppelin/test-helpers");

contract("Study", (accounts) => {
  let study;
  beforeEach(async () => {
    study = await Study.deployed();
  });

  //Constructor
  it("should set founder and total supply to founder address", async () => {
    const founderAddress = await study.founder();
    const founderBalance = await study.balanceOf(accounts[0]);
    assert(founderAddress == accounts[0]);
    assert(founderBalance.toNumber() == 100000);
  });

  // Transfer function
  it("should not transfer if balance is low", async () => {
    await expectRevert(
      study.transfer(accounts[1], 100000 + 10, { from: accounts[0] }),
      "You do not have enough tokens"
    );
  });

  it("should transfer balance", async () => {
    const amount = web3.utils.toBN(100);
    const initialBalanceReceiver = await study.balanceOf(accounts[1]);
    const receipt = await study.transfer(accounts[1], amount, {
      from: accounts[0],
    });
    const finalBalanceReciver = await study.balanceOf(accounts[1]);
    const transferedAmount = finalBalanceReciver - initialBalanceReceiver;
    const senderLeftBalance = await study.balanceOf(accounts[0]); //100000 - 100 = 99900
    assert(transferedAmount == amount);
    assert(senderLeftBalance == 99900);
    expectEvent(receipt, "Transfer", {
      from: accounts[0],
      to: accounts[1],
      value: amount,
    });
  });

  //TransferFrom && Approve && balanceOf
  it("should transfer if approved", async () => {
    const amount = web3.utils.toBN(400);
    let receipt;
    let allowance;

    allowance = await study.allowance(accounts[0], accounts[1]);
    assert(allowance == 0); //initially not approved so 0(zero)
    receipt = await study.approve(accounts[1], amount, { from: accounts[0] });
    allowance = await study.allowance(accounts[0], accounts[1]);
    assert(allowance.toNumber() == amount); //approved 500
    expectEvent(receipt, "Approval", {
      owner: accounts[0],
      spender: accounts[1],
      value: amount,
    });

    const initialBalanceReceiver = await study.balanceOf(accounts[1]);
    await study.transferFrom(accounts[0], accounts[1], amount);
    const finalBalanceReciver = await study.balanceOf(accounts[1]);
    const transferedAmount = finalBalanceReciver - initialBalanceReceiver;
    assert(transferedAmount == 400);
  });

  it("should not transfer if not approved", async () => {
    await expectRevert(
      study.transferFrom(accounts[2], accounts[1], 100),
      "You do not have approval"
    );
  });

  it("should not approve if balance is low", async () => {
    await expectRevert(
      study.approve(accounts[2], 700, { from: accounts[1] }),
      "You do not have enough tokens"
    );
    //if check for below 500 it will give error because
    // we have transfered 500 to accounts[1] in above test cases;
  });
});
