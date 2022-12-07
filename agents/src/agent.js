const { Finding, FindingSeverity, FindingType } = require("forta-agent");

const TARGET_ADDRESS = "0x1111111254EEB25477B68fb85Ed929f73A960582"

// https://docs.clipper.exchange/faq
const WHITELISTED_ADDRESSES = [
  "0xE7b0CE0526fbE3969035a145C9e9691d4d9D216c",
  "0xcc12532e95c2a6a4c53af153b9b739a3cc9218a7",
  "0x2e9c6Dcdca22A5952A88C4b18EDB5B54C5155BC9",
  "0xe82906b6B1B04f631D126c974Af57a3A7B6a99d9",
  "0xf0f455E8b8F4f96Ae5109493C5d3eA5e2c09de47",
]

// 1inch reference code can be found on etherscan
// https://etherscan.io/address/0x1111111254eeb25477b68fb85ed929f73a960582#code
const TARGET_METHODS = [
  `function clipperSwapToWithPermit(
    address clipperExchange,
    address payable recipient,
    address srcToken,
    address dstToken,
    uint256 inputAmount,
    uint256 outputAmount,
    uint256 goodUntil,
    bytes32 r,
    bytes32 vs,
    bytes calldata permit
  )`,
  `function clipperSwap(
    address clipperExchange,
    address srcToken,
    address dstToken,
    uint256 inputAmount,
    uint256 outputAmount,
    uint256 goodUntil,
    bytes32 r,
    bytes32 vs
  )`,
  `function clipperSwapTo(
    address clipperExchange,
    address payable recipient,
    address srcToken,
    address dstToken,
    uint256 inputAmount,
    uint256 outputAmount,
    uint256 goodUntil,
    bytes32 r,
    bytes32 vs
  )`
]

const handleTransaction = async (txEvent) => {
  const findings = []
  const whitelist = new Set(WHITELISTED_ADDRESSES)

  for (const TARGET_FUNCTION of TARGET_METHODS) {
    const calls = txEvent.filterFunction(
      TARGET_FUNCTION,
      TARGET_ADDRESS
    );


    calls.forEach((call) => {
      if (whitelist.has(call.args[0])) {
        return;
      }

      findings.push(
        Finding.fromObject({
          name: "1inch wrong clipper address",
          description: "A call to 1inch clipperSwap* methods with a wrong clipper address",
          alertId: "FORTA-1INCH-WRONG-CLIPPER",
          severity: FindingSeverity.High,
          type: FindingType.Suspicious,
          metadata: {
          },
        })
      );
    });
  }

  return findings;
};


module.exports = {
  handleTransaction,
  TARGET_ADDRESS,
  WHITELISTED_ADDRESSES,
};
