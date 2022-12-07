const {
  FindingType,
  FindingSeverity,
  Finding,
  createTransactionEvent,
} = require("forta-agent");


const {
  handleTransaction,
  TARGET_ADDRESS,
  WHITELISTED_ADDRESSES,
} = require("./agent");

const { ethers } = require("hardhat")

async function getEventEmitter(atAddress) {
  const EventEmitter = await ethers.getContractFactory("EventEmitter")
  const eventEmitter = await EventEmitter.deploy()
  const eventEmitterCode = await ethers.provider.send("eth_getCode", [eventEmitter.address,]);
  await ethers.provider.send("hardhat_setCode", [atAddress, eventEmitterCode])
  return await ethers.getContractAt("EventEmitter", atAddress)
}

it("Catch an incorrect clipper address on 1inch", async () => {
  const eventEmitter = await getEventEmitter(TARGET_ADDRESS)

  const tx = await eventEmitter.clipperSwap(
    // address clipperExchange,
    "0x1111111111111111111111111111111111111111",
    // address srcToken,
    "0x1234567890123456789012345678901234567890",
    // address dstToken,
    "0x1234567890123456789012345678901234567890",
    // uint256 inputAmount,
    0,
    // uint256 outputAmount,
    0,
    // uint256 goodUntil,
    0,
    // bytes32 r,
    "0x0000000000000000000000000000000000000000000000000000000000000000",
    // bytes32 vs
    "0x0000000000000000000000000000000000000000000000000000000000000000",
  )
  const rx = await tx.wait()

  const txEvent = createTransactionEvent({
    transaction: tx,
    logs: rx.logs,
    block: {
      hash: tx.blockHash,
      number: tx.blockNumber,
      timestamp: Date.now(),
    },
  });
  const findings = await handleTransaction(txEvent);
  expect(findings.length).toBe(1)
})

it("Do not catch a correct clipper address on 1inch", async () => {
  const eventEmitter = await getEventEmitter(TARGET_ADDRESS)

  const tx = await eventEmitter.clipperSwap(
    // address clipperExchange,
    WHITELISTED_ADDRESSES[0],
    // address srcToken,
    "0x1234567890123456789012345678901234567890",
    // address dstToken,
    "0x1234567890123456789012345678901234567890",
    // uint256 inputAmount,
    0,
    // uint256 outputAmount,
    0,
    // uint256 goodUntil,
    0,
    // bytes32 r,
    "0x0000000000000000000000000000000000000000000000000000000000000000",
    // bytes32 vs
    "0x0000000000000000000000000000000000000000000000000000000000000000",
  )
  const rx = await tx.wait()

  const txEvent = createTransactionEvent({
    transaction: tx,
    logs: rx.logs,
    block: {
      hash: tx.blockHash,
      number: tx.blockNumber,
      timestamp: Date.now(),
    },
  });
  const findings = await handleTransaction(txEvent);
  expect(findings.length).toBe(0)
})

it("Do not catch an incorrect clipper address on a contract that is NOT 1inch", async () => {
  const eventEmitter = await getEventEmitter("0x6666666666666666666666666666666666666666")

  const tx = await eventEmitter.clipperSwap(
    // address clipperExchange,
    "0x1111111111111111111111111111111111111111",
    // address srcToken,
    "0x1234567890123456789012345678901234567890",
    // address dstToken,
    "0x1234567890123456789012345678901234567890",
    // uint256 inputAmount,
    0,
    // uint256 outputAmount,
    0,
    // uint256 goodUntil,
    0,
    // bytes32 r,
    "0x0000000000000000000000000000000000000000000000000000000000000000",
    // bytes32 vs
    "0x0000000000000000000000000000000000000000000000000000000000000000",
  )
  const rx = await tx.wait()

  const txEvent = createTransactionEvent({
    transaction: tx,
    logs: rx.logs,
    block: {
      hash: tx.blockHash,
      number: tx.blockNumber,
      timestamp: Date.now(),
    },
  });
  const findings = await handleTransaction(txEvent);
  expect(findings.length).toBe(0)
})

