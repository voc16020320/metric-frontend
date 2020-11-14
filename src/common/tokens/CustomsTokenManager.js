// @flow

import {Token} from "./token";

export class CustomTokenManager {

    constructor() {
        this.customtokens = {
            version: 1,
            tokens: []
        }
    }

    addToken(token: Token) {
        if (this.customtokens.tokens.find(t => t.address === token.address) === undefined) {
            this.customtokens.tokens.push(token)
            this.persist()
        }
    }

    persist() {
        localStorage.setItem(this.customTokensTag, JSON.stringify(this.customtokens))
    }

    init() {
        let persistedTokens = localStorage.getItem(this.customTokensTag)
        if (persistedTokens !== null) {
            this.merge(JSON.parse(persistedTokens))
        }
    }

    merge(persistedTokens) {
        if (persistedTokens.version === 1) {
            this.customtokens = persistedTokens
        }
    }

    customTokensTag = "custom-tokens"
}
