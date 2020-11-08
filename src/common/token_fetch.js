import EthIcon from './eth.png'
import HypeIcon from './hype.png'
import { accountAddress } from "./wallet_manager";
import { Erc20ContractProxy } from "./erc20_contract_proxy";
import {fetchJson} from "./json_api_fetch";


export function registerForTokenListUpdate(item) {
    register.push(item)
}

export function disableToken(symbol) {
    for (let i = 0; i < tokens.length; i++) {
        if (tokens[i].symbol.toLowerCase() === symbol.toLowerCase()) {
            tokens[i].disabled = true
        }
    }
}

export function tokensList() { return tokens }

export async function fetchTokensBalances() {

    await Promise.all(
        tokens.map(async (t, index) => {
            let token = t
            token.balance = await fetchTokenBalance(token)
            tokens[index] = token
        })
    )

    setTimeout(fetchTokensBalances, 10000)
}

async function fetchTokenBalance(token) {

    let tokenBalance = 0

    if (token.symbol.toLowerCase() === "eth") {
        tokenBalance = await window.web3.eth.getBalance(accountAddress())
    } else {
        let contract = Erc20ContractProxy.erc20Contract(token.address)
        tokenBalance = await contract.methods.balanceOf(accountAddress()).call()
    }

    tokenBalance = isNaN(tokenBalance) ? 0 : tokenBalance / (10**token.decimals)

    return tokenBalance
}

export async function loadTokenList()
{
    await fetchJson("https://raw.githubusercontent.com/pro-blockchain-com/uniswap-token-list/4de4a4cfd348f7a745e7fec4ae8653e7f8e7d48d/tokens.1inch.eth.link.2020-09-05.json")
        .then(json => {
            if (json.tokens !== undefined) {
                return Array.from(json.tokens)
            } else {
                return []
            }
        })
        .then(at => {
            at.forEach(t => {
                addToken({
                    balance: 0,
                    address: t.address,
                    symbol: t.symbol,
                    decimals: t.decimals,
                    logoURI: t.logoURI,
                    volume_limit: -1
                })
            })
        })

    await Promise.all(
        register.map(item => item.onTokenListUpdate())
    )
}

export function isTokenAmountOverLimit(token, amount) {
    return amount.isGreaterThan(token.volume_limit * (10 ** token.decimals))
}

export function addToken(token) {
    if (tokens.find(t => t.symbol === token.symbol) === undefined) {
        tokens.push(token)
    }
}

let tokens = [
    {
        address: "0x6e36556b3ee5aa28def2a8ec3dae30ec2b208739",
        decimals: 18,
        symbol: "BUILD",
        logoURI: "https://etherscan.io/token/images/build_32.png",
        balance: 0,
        volume_limit: -1,
        disabled: false
    },
    {
        address: "0xEfc1C73A3D8728Dc4Cf2A18ac5705FE93E5914AC",
        decimals: 18,
        symbol: "METRIC",
        logoURI: "https://etherscan.io/images/main/empty-token.png",
        balance: 0,
        volume_limit: -1,
        disabled: false
    },
    {
        address: "0x0000000000000000000000000000000000000000",
        symbol: "ETH",
        decimals: 18,
        logoURI: EthIcon,
        balance: 0,
        volume_limit: -1,
        disabled: false
    },
    {
        address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
        decimals: 18,
        symbol: "DAI",
        logoURI: "https://1inch.exchange/assets/tokens/0x6b175474e89094c44da98b954eedeac495271d0f.png",
        balance: 0,
        volume_limit: 10,
        disabled: false
    },
    {
        address: "0xe1212f852c0ca3491ca6b96081ac3cf40e989094",
        decimals: 18,
        symbol: "HYPE",
        logoURI: HypeIcon,
        balance: 0,
        volume_limit: -1,
        disabled: false
    }
]

let register = []
