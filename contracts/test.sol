// 1inch reference code can be found on etherscan
// https://etherscan.io/address/0x1111111254eeb25477b68fb85ed929f73a960582#code

contract EventEmitter {
    function clipperSwapToWithPermit(
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
    ) external returns (uint256 returnAmount) {
        return 0;
    }

    function clipperSwap(
        address clipperExchange,
        address srcToken,
        address dstToken,
        uint256 inputAmount,
        uint256 outputAmount,
        uint256 goodUntil,
        bytes32 r,
        bytes32 vs
    ) external payable returns (uint256 returnAmount) {
        return 0;
    }

    function clipperSwapTo(
        address clipperExchange,
        address payable recipient,
        address srcToken,
        address dstToken,
        uint256 inputAmount,
        uint256 outputAmount,
        uint256 goodUntil,
        bytes32 r,
        bytes32 vs
    ) public payable returns (uint256 returnAmount) {
        return 0;
    }
}
