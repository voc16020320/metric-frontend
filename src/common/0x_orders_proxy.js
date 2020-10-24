import {Orderbook} from "@0x/orderbook";
import {BigNumber, providerUtils } from '@0x/utils';
import {orderFactory} from '@0x/order-utils/lib/src/order_factory';
import {assetDataUtils, MetamaskSubprovider } from '0x.js'
import {accountAddress} from './wallet_manager'
import {getContractAddressesForChainOrThrow} from "@0x/contract-addresses";
import {Erc20ContractProxy} from "./erc20_contract_proxy";

export const ZeroXOrdersProxy = {

    get0xMeshOrderBook: function() { return orderBook },

    is0xApprovedForToken: async function(address, amount) {
        let zeroXAllowanceTargetAddress = await zeroXContractAddresses().then(a => a.erc20Proxy)
        return await Erc20ContractProxy.isAddressApprovedForToken(zeroXAllowanceTargetAddress, address, amount)
    },

    approveZeroXAllowance: async function(tokenAddress) {
        let zeroXAllowanceTargetAddress = await zeroXContractAddresses().then(a => a.erc20Proxy)
        await Erc20ContractProxy.approveTokenForTargetAddress(tokenAddress, zeroXAllowanceTargetAddress)
    },

    submitOrder: async function(order) {

        let signedOrder = await orderFactory.createSignedOrderAsync(
            new MetamaskSubprovider(window.web3.currentProvider),
            accountAddress(),
            new BigNumber(order.makerAssetAmount),
            assetDataUtils.encodeERC20AssetData(order.makerAssetAddress),
            new BigNumber(order.takerAssetAmount),
            assetDataUtils.encodeERC20AssetData(order.takerAssetAddress),
            await zeroXContractAddresses().then(a => a.exchange),
            {
                // expirationTimeSeconds: new BigNumber(3600)
                // makerFee?: BigNumber;
                // takerFee?: BigNumber;
                // feeRecipientAddress?: string;
                // salt?: BigNumber;
                // expirationTimeSeconds?: BigNumber;
                // makerFeeAssetData?: string;
                // takerFeeAssetData?: string;
            }
        )

        return await orderBook.addOrdersAsync([signedOrder])
    }
}

function initOrderBook() {
    return Orderbook.getOrderbookForPollingProvider({
        httpEndpoint : "https://api.0x.org/sra/v3",
        pollingIntervalMs: 10000
    })
}

async function zeroXContractAddresses() {
    let chainId = await providerUtils.getChainIdAsync(new MetamaskSubprovider(window.web3.currentProvider))
    return getContractAddressesForChainOrThrow(chainId)
}

let orderBook = initOrderBook()
