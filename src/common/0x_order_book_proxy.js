import {HttpClient} from "@0x/connect";
import {getContractWrapper} from "./wallet_manager";
import {BigNumber} from "@0x/utils";
import {isTokenAmountOverLimit, tokensList} from "./token_fetch";

export function registerForOrderBookUpdateEvents(object) {
    callbacksRegister.push(object)
}

export function registerForBaseTokenChange(object) {
    baseTokenChangeRegister.push(object)
}

export function getReplayClient() {
    return relayClient
}

export function getOrderBookBids() {
    return bids
}

export function getOrderBookAsks() {
    return asks
}

export async function synchronizeOrderBook() {

    if (tokenCouple.quoteToken !== null && tokenCouple.baseToken !== null) {
        await updateOrderBook()
    }

    setTimeout(synchronizeOrderBook, 1000)
}

export async function setBaseToken(token) {
    tokenCouple.baseToken = token
    bids=[]
    asks = []
    baseTokenChangeRegister.forEach(c => c.onBaseTokenUpdate())
}


export function setQuoteToken(token) {
    tokenCouple.quoteToken = token
}

export function getBaseToken() {
    return tokenCouple.baseToken
}

export function getQuoteToken() {
    return tokenCouple.quoteToken
}

export async function getBidsMatching(baseTokenAddress, quoteTokenAddress) {
    let orders = await getOrdersMatching(baseTokenAddress, quoteTokenAddress)
    return orders.bids
}

async function updateOrderBook() {
    let baseToken = getBaseToken()
    let quoteToken = getQuoteToken()

    let orderBookUpdate =
        await getOrdersMatching(
            baseToken.address,
            quoteToken.address
        )

    if (baseToken.symbol === getBaseToken().symbol && quoteToken.symbol === getQuoteToken().symbol) {
        bids = orderBookUpdate.bids
        asks = orderBookUpdate.asks

        await Promise.all(
            callbacksRegister.map(obj => obj.onOrderBookUpdate())
        )
    }

}

async function getOrdersMatching(baseTokenAddress, quoteTokenAddress) {
    let contractWrapper = await getContractWrapper()

    let baseToken = tokensList().find(t => t.address === baseTokenAddress)
    let quoteToken = tokensList().find(t => t.address === quoteTokenAddress)

    const baseAssetData =
        await contractWrapper.devUtils.encodeERC20AssetData(baseToken.address).callAsync();

    const quoteAssetData =
        await contractWrapper.devUtils.encodeERC20AssetData(quoteToken.address).callAsync();

    let orders = await relayClient.getOrderbookAsync(
        {
            baseAssetData: baseAssetData,
            quoteAssetData: quoteAssetData,
        }
    )

    let filteredBids =
        orders.bids.records
            .filter(b => {
                let takerAmount = new BigNumber(parseInt(b.metaData.remainingFillableTakerAssetAmount))
                let makerAmount =
                    b.order.makerAssetAmount
                        .multipliedBy(parseInt(b.metaData.remainingFillableTakerAssetAmount))
                        .dividedToIntegerBy(b.order.takerAssetAmount)

                return b.order.takerAddress === "0x0000000000000000000000000000000000000000" &&
                    isTokenAmountOverLimit(getBaseToken(), takerAmount) &&
                    isTokenAmountOverLimit(getQuoteToken(), makerAmount)
            })

    let filteredAsks =
        orders.asks.records
            .filter(b => {
                let takerAmount = new BigNumber(parseInt(b.metaData.remainingFillableTakerAssetAmount))
                let makerAmount =
                    b.order.makerAssetAmount
                        .multipliedBy(parseInt(b.metaData.remainingFillableTakerAssetAmount))
                        .dividedToIntegerBy(b.order.takerAssetAmount)

                return b.order.takerAddress === "0x0000000000000000000000000000000000000000" &&
                        isTokenAmountOverLimit(getQuoteToken(), takerAmount) &&
                        isTokenAmountOverLimit(getBaseToken(), makerAmount)
            })

    return {
        bids: filteredBids,
        asks: filteredAsks
    }

}


let bids = []
let asks = []

let tokenCouple = {
    baseToken: null,
    quoteToken: null
}

let relayClient = new HttpClient("https://api.0x.org/sra/v3")

let callbacksRegister = []
let baseTokenChangeRegister = []
