import "@babel/polyfill";
import '@riotjs/hot-reload'
import {component, install} from 'riot'
import jquery from "jquery";
import {tokensList, nativeTokens, erc20Abi, loadTokenList, fetchTokensBalances, addToken} from "./common/token_fetch";
import {accountAddress, initWeb3, connectWallet, updateAccountAddress, isWalletConnected} from './common/wallet_manager'
import { setDarkTheme, setLightTheme, isDarkThemeSet, isLightThemeSet, initTheme } from './common/theme_manager'

export default (window.$ = window.jQuery = jquery);

import Main from './components/main/main.riot'

install(c => {

    c.round = function(num, decimals) {
        return +(Math.round(num + `e+${decimals}`) + `e-${decimals}`)
    }

    c.accountAddress = accountAddress
    c.erc20Abi = erc20Abi
    c.initWeb3 = initWeb3
    c.connectWallet = connectWallet
    c.updateAccountAddress = updateAccountAddress

    c.tokensList = tokensList
    c.addToken = addToken
    c.nativeTokens = nativeTokens
    c.loadTokenList = loadTokenList
    c.fetchTokensBalances = fetchTokensBalances
    c.isWalletConnected = isWalletConnected

    c.isDarkThemeSet = isDarkThemeSet
    c.isLightThemeSet = isLightThemeSet
    c.setDarkTheme = setDarkTheme
    c.setLightTheme = setLightTheme
    c.initTheme = initTheme

})

component(Main)(document.getElementById('app'), {})
