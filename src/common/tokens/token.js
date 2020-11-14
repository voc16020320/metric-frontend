// @flow

export class Token {
    constructor(symbol, address, decimals, logURL = null) {
        this.symbol = symbol
        this.address = address
        this.decimals = decimals
        this.logURL = logURL
    }
}
