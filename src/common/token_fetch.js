import EthIcon from '../components/token_selector/eth.png'

export let nativeTokens = {
    build: {
        address: "0x6e36556b3ee5aa28def2a8ec3dae30ec2b208739",
        decimals: 18,
        symbol: "BUILD",
        logoURI: "https://etherscan.io/token/images/build_32.png",
        balance: 0
    },
    metric: {
        address: "0xEfc1C73A3D8728Dc4Cf2A18ac5705FE93E5914AC",
        decimals: 18,
        symbol: "METRIC",
        logoURI: "https://etherscan.io/images/main/empty-token.png",
        balance: 0
    },
    ethereum: {
        address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        symbol: "ETH",
        decimals: 18,
        logoURI: EthIcon,
        balance: 0
    }
}

let tokens = [nativeTokens.build, nativeTokens.metric, nativeTokens.ethereum]

export function tokensList() { return tokens }

export function addToken(token) {
    tokens.push(token)
}

export async function loadTokenList(observer)
{

    function handleErrors(response) {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response;
    }

    await fetch("https://wispy-bird-88a7.uniswap.workers.dev/?url=http://tokens.1inch.eth.link", {method: "GET"})
        .then(handleErrors)
        .then(r => r.json())
        .then(json => Array.from(json.tokens))
        .then(at => {
            tokens = [nativeTokens.build, nativeTokens.metric, nativeTokens.ethereum]
            at.forEach(t => {
                addToken({
                    balance: 0,
                    address: t.address,
                    symbol: t.symbol,
                    decimals: t.decimals,
                    logoURI: t.logoURI
                })
            })
        })
        .catch(_ => console.log("Token list retrieval failed"))

    observer.update()
}

export async function fetchTokensBalances(accountAddress) {

    await Promise.all(
        tokens.map(async (t, index) => {
            let token = t
            token.balance = await fetchTokenBalance(token, accountAddress)
            tokens[index] = token
        })
    )
}

async function fetchTokenBalance(token, accountAddress) {

    let tokenBalance = 0

    if (token.symbol.toLowerCase() === nativeTokens.ethereum.symbol.toLowerCase()) {
        tokenBalance = await window.web3.eth.getBalance(accountAddress)
    } else {
        let contract = new window.web3.eth.Contract(erc20Abi, token.address)
        tokenBalance = await contract.methods.balanceOf(accountAddress).call()
    }

    tokenBalance = isNaN(tokenBalance) ? 0 : tokenBalance / (10**token.decimals)

    return tokenBalance
}

export let erc20Abi = [ { "constant": true, "inputs": [], "name": "name", "outputs": [ { "name": "", "type": "string" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "spender", "type": "address" }, { "name": "value", "type": "uint256" } ], "name": "approve", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_owner", "type": "address" } ], "name": "nominateNewOwner", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "from", "type": "address" }, { "name": "to", "type": "address" }, { "name": "value", "type": "uint256" } ], "name": "transferFrom", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [ { "name": "", "type": "uint8" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "nominatedOwner", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "owner", "type": "address" } ], "name": "balanceOf", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_target", "type": "address" } ], "name": "setTarget", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "acceptOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "callData", "type": "bytes" }, { "name": "numTopics", "type": "uint256" }, { "name": "topic1", "type": "bytes32" }, { "name": "topic2", "type": "bytes32" }, { "name": "topic3", "type": "bytes32" }, { "name": "topic4", "type": "bytes32" } ], "name": "_emit", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "useDELEGATECALL", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [ { "name": "", "type": "string" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "to", "type": "address" }, { "name": "value", "type": "uint256" } ], "name": "transfer", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "value", "type": "bool" } ], "name": "setUseDELEGATECALL", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "target", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "owner", "type": "address" }, { "name": "spender", "type": "address" } ], "name": "allowance", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "inputs": [ { "name": "_owner", "type": "address" } ], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "payable": true, "stateMutability": "payable", "type": "fallback" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" } ], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "owner", "type": "address" }, { "indexed": true, "name": "spender", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" } ], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "newTarget", "type": "address" } ], "name": "TargetUpdated", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "newOwner", "type": "address" } ], "name": "OwnerNominated", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "oldOwner", "type": "address" }, { "indexed": false, "name": "newOwner", "type": "address" } ], "name": "OwnerChanged", "type": "event" } ]
