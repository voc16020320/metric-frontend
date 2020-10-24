
export async function getTokenUsdPrice(address, symbol) {

    let apiurl = `https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=${address}&vs_currencies=usd`
    if (symbol.toLowerCase() === 'eth'){
        apiurl ="https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd&include_market_cap=false&include_24hr_vol=false&include_24hr_change=false&include_last_updated_at=false"
    }

    let jsonRes = await fetch(apiurl, { method: "GET" }).then( r => r.json())

    if (symbol.toLowerCase() === 'eth'){
        return jsonRes["ethereum"].usd
    }

    if (typeof jsonRes[`${address.toLowerCase()}`] === undefined){
        return 0
    }

    return jsonRes[`${address.toLowerCase()}`].usd
}
