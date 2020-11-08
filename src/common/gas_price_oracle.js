import {fetchJson} from "./json_api_fetch";

export async function getFastGasPriceInWei() {
    let fastGasPrice = await getEtherChainFasGasPriceInWei()
    let standardsGasPrice = await getDefaultGasPriceInWei()
    return Math.max(fastGasPrice, standardsGasPrice * 1.25)
}

async function getEtherChainFasGasPriceInWei() {

    let gasPrices = await fetchJson("https://www.etherchain.org/api/gasPriceOracle")

    let fastGasPrice = 0

    if (gasPrices !== undefined && gasPrices.fast !== undefined) {
        fastGasPrice = 0
    }

    return fastGasPrice * (10 ** 9)
}

async function getDefaultGasPriceInWei() {
    return await window.web3.eth.getGasPrice()
}
