import { Erc20ContractProxy } from "./erc20_contract_proxy";

export const OneSplitContactProxy = {

    oneSplitContract: function() {
        return Erc20ContractProxy.getContract(oneSplitAbi, oneSplitAddress)
    },

    isOneSplitApprovedForTokenAddress: async function(address, amount) {
        return await Erc20ContractProxy.isAddressApprovedForToken(oneSplitAddress, address, amount)
    },

    approveOneSplitForToken: function(address) {
        Erc20ContractProxy.approveTokenForTargetAddress(
            address,
            oneSplitAddress,
            function (a,b) {},
            function (a) {}
        )
    }
}

let oneSplitAddress = "0x50FDA034C0Ce7a8f7EFDAebDA7Aa7cA21CC1267e"

let oneSplitAbi = [ { "constant": true, "inputs": [ { "internalType": "contract IERC20", "name": "fromToken", "type": "address" }, { "internalType": "contract IERC20", "name": "destToken", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "uint256", "name": "parts", "type": "uint256" }, { "internalType": "uint256", "name": "flags", "type": "uint256" } ], "name": "getExpectedReturn", "outputs": [ { "internalType": "uint256", "name": "returnAmount", "type": "uint256" }, { "internalType": "uint256[]", "name": "distribution", "type": "uint256[]" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "contract IERC20", "name": "fromToken", "type": "address" }, { "internalType": "contract IERC20", "name": "destToken", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "uint256", "name": "minReturn", "type": "uint256" }, { "internalType": "uint256[]", "name": "distribution", "type": "uint256[]" }, { "internalType": "uint256", "name": "flags", "type": "uint256" }, { "internalType": "address", "name": "referral", "type": "address" }, { "internalType": "uint256", "name": "feePercent", "type": "uint256" } ], "name": "swapWithReferral", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "payable": true, "stateMutability": "payable", "type": "function" } ]
