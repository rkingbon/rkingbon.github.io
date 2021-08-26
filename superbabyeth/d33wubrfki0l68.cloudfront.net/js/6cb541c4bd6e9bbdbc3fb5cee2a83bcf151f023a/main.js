"use strict";

/**
 * Example JavaScript code that interacts with the page and Web3 wallets
 */

// Unpkg imports
const Web3Modal = window.Web3Modal.default;
const WalletConnectProvider = window.WalletConnectProvider.default;
const Fortmatic = window.Fortmatic;
const evmChains = window.evmChains;

// Web3modal instance
let web3Modal

// Chosen wallet provider given by the dialog window
let provider;


// Address of the selected account
let selectedAccount;


/**
 * Setup the orchestra
 */
function init() {

    // console.log("Initializing example");
    // console.log("WalletConnectProvider is", WalletConnectProvider);
    // console.log("Fortmatic is", Fortmatic);
    // console.log("window.web3 is", window.web3, "window.ethereum is", window.ethereum);

    // Check that the web page is run in a secure context,
    // as otherwise MetaMask won't be available
    //   if(location.protocol !== 'https:') {
    //     // https://ethereum.stackexchange.com/a/62217/620
    //     const alert = document.querySelector("#alert-error-https");
    //     alert.style.display = "block";
    //     document.querySelector("#btn-connect").setAttribute("disabled", "disabled")
    //     return;
    //   }

    // Tell Web3modal what providers we have available.
    // Built-in web browser provider (only one can exist as a time)
    // like MetaMask, Brave or Opera is added automatically by Web3modal
    const providerOptions = {
        walletconnect: {
            package: WalletConnectProvider,
            options: {
                // Mikko's test key - don't copy as your mileage may vary
                infuraId: "8043bb2cf99347b1bfadfb233c5325c0",
            }
        },

        fortmatic: {
            package: Fortmatic,
            options: {
                // Mikko's TESTNET api key
                key: "pk_test_391E26A3B43A3350"
            }
        }
    };

    web3Modal = new Web3Modal({
        cacheProvider: false, // optional
        providerOptions, // required
        disableInjectedProvider: false, // optional. For MetaMask / Brave / Opera.
    });

    // console.log("Web3Modal instance is", web3Modal);
    if (window.ethereum){
        getTotalRewardsDistributed()

    }
}


/**
 * Kick in the UI action after Web3modal dialog has chosen a provider
 */
const ABI = [{
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
    }, {
        "indexed": true,
        "internalType": "address",
        "name": "spender",
        "type": "address"
    }, {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
    }],
    "name": "Approval",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": true,
        "internalType": "address",
        "name": "account",
        "type": "address"
    }, {
        "indexed": false,
        "internalType": "bool",
        "name": "isExcluded",
        "type": "bool"
    }],
    "name": "ExcludeFromFees",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": false,
        "internalType": "address[]",
        "name": "accounts",
        "type": "address[]"
    }, {
        "indexed": false,
        "internalType": "bool",
        "name": "isExcluded",
        "type": "bool"
    }],
    "name": "ExcludeMultipleAccountsFromFees",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": true,
        "internalType": "uint256",
        "name": "newValue",
        "type": "uint256"
    }, {
        "indexed": true,
        "internalType": "uint256",
        "name": "oldValue",
        "type": "uint256"
    }],
    "name": "GasForProcessingUpdated",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": true,
        "internalType": "address",
        "name": "newLiquidityWallet",
        "type": "address"
    }, {
        "indexed": true,
        "internalType": "address",
        "name": "oldLiquidityWallet",
        "type": "address"
    }],
    "name": "LiquidityWalletUpdated",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
    }, {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
    }],
    "name": "OwnershipTransferred",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": false,
        "internalType": "uint256",
        "name": "iterations",
        "type": "uint256"
    }, {
        "indexed": false,
        "internalType": "uint256",
        "name": "claims",
        "type": "uint256"
    }, {
        "indexed": false,
        "internalType": "uint256",
        "name": "lastProcessedIndex",
        "type": "uint256"
    }, {
        "indexed": true,
        "internalType": "bool",
        "name": "automatic",
        "type": "bool"
    }, {
        "indexed": false,
        "internalType": "uint256",
        "name": "gas",
        "type": "uint256"
    }, {
        "indexed": true,
        "internalType": "address",
        "name": "processor",
        "type": "address"
    }],
    "name": "ProcessedDividendTracker",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": false,
        "internalType": "uint256",
        "name": "tokensSwapped",
        "type": "uint256"
    }, {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
    }],
    "name": "SendDividends",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": true,
        "internalType": "address",
        "name": "pair",
        "type": "address"
    }, {
        "indexed": true,
        "internalType": "bool",
        "name": "value",
        "type": "bool"
    }],
    "name": "SetAutomatedMarketMakerPair",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": false,
        "internalType": "uint256",
        "name": "tokensSwapped",
        "type": "uint256"
    }, {
        "indexed": false,
        "internalType": "uint256",
        "name": "ethReceived",
        "type": "uint256"
    }, {
        "indexed": false,
        "internalType": "uint256",
        "name": "tokensIntoLiqudity",
        "type": "uint256"
    }],
    "name": "SwapAndLiquify",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
    }, {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
    }, {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
    }],
    "name": "Transfer",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": true,
        "internalType": "address",
        "name": "newAddress",
        "type": "address"
    }, {
        "indexed": true,
        "internalType": "address",
        "name": "oldAddress",
        "type": "address"
    }],
    "name": "UpdateDividendTracker",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": true,
        "internalType": "address",
        "name": "newAddress",
        "type": "address"
    }, {
        "indexed": true,
        "internalType": "address",
        "name": "oldAddress",
        "type": "address"
    }],
    "name": "UpdateUniswapV2Router",
    "type": "event"
}, {
    "inputs": [],
    "name": "MATIC",
    "outputs": [{
        "internalType": "address",
        "name": "",
        "type": "address"
    }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "MATICRewardsFee",
    "outputs": [{
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "_devWalletAddress",
    "outputs": [{
        "internalType": "address",
        "name": "",
        "type": "address"
    }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "address",
        "name": "",
        "type": "address"
    }],
    "name": "_isBlacklisted",
    "outputs": [{
        "internalType": "bool",
        "name": "",
        "type": "bool"
    }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "_marketingWalletAddress",
    "outputs": [{
        "internalType": "address",
        "name": "",
        "type": "address"
    }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "address",
        "name": "owner",
        "type": "address"
    }, {
        "internalType": "address",
        "name": "spender",
        "type": "address"
    }],
    "name": "allowance",
    "outputs": [{
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "address",
        "name": "spender",
        "type": "address"
    }, {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
    }],
    "name": "approve",
    "outputs": [{
        "internalType": "bool",
        "name": "",
        "type": "bool"
    }],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "address",
        "name": "",
        "type": "address"
    }],
    "name": "automatedMarketMakerPairs",
    "outputs": [{
        "internalType": "bool",
        "name": "",
        "type": "bool"
    }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "address",
        "name": "account",
        "type": "address"
    }],
    "name": "balanceOf",
    "outputs": [{
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "address",
        "name": "account",
        "type": "address"
    }, {
        "internalType": "bool",
        "name": "value",
        "type": "bool"
    }],
    "name": "blacklistAddress",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [],
    "name": "claim",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [],
    "name": "deadWallet",
    "outputs": [{
        "internalType": "address",
        "name": "",
        "type": "address"
    }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "decimals",
    "outputs": [{
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
    }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "address",
        "name": "spender",
        "type": "address"
    }, {
        "internalType": "uint256",
        "name": "subtractedValue",
        "type": "uint256"
    }],
    "name": "decreaseAllowance",
    "outputs": [{
        "internalType": "bool",
        "name": "",
        "type": "bool"
    }],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "address",
        "name": "account",
        "type": "address"
    }],
    "name": "dividendTokenBalanceOf",
    "outputs": [{
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "dividendTracker",
    "outputs": [{
        "internalType": "contract BABYMATICDividendTracker",
        "name": "",
        "type": "address"
    }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "address",
        "name": "account",
        "type": "address"
    }],
    "name": "excludeFromDividends",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "address",
        "name": "account",
        "type": "address"
    }, {
        "internalType": "bool",
        "name": "excluded",
        "type": "bool"
    }],
    "name": "excludeFromFees",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "address[]",
        "name": "accounts",
        "type": "address[]"
    }, {
        "internalType": "bool",
        "name": "excluded",
        "type": "bool"
    }],
    "name": "excludeMultipleAccountsFromFees",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [],
    "name": "gasForProcessing",
    "outputs": [{
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "address",
        "name": "account",
        "type": "address"
    }],
    "name": "getAccountDividendsInfo",
    "outputs": [{
        "internalType": "address",
        "name": "",
        "type": "address"
    }, {
        "internalType": "int256",
        "name": "",
        "type": "int256"
    }, {
        "internalType": "int256",
        "name": "",
        "type": "int256"
    }, {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }, {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }, {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }, {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }, {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
    }],
    "name": "getAccountDividendsInfoAtIndex",
    "outputs": [{
        "internalType": "address",
        "name": "",
        "type": "address"
    }, {
        "internalType": "int256",
        "name": "",
        "type": "int256"
    }, {
        "internalType": "int256",
        "name": "",
        "type": "int256"
    }, {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }, {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }, {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }, {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }, {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "getClaimWait",
    "outputs": [{
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "getLastProcessedIndex",
    "outputs": [{
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "getNumberOfDividendTokenHolders",
    "outputs": [{
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "getTotalDividendsDistributed",
    "outputs": [{
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "address",
        "name": "spender",
        "type": "address"
    }, {
        "internalType": "uint256",
        "name": "addedValue",
        "type": "uint256"
    }],
    "name": "increaseAllowance",
    "outputs": [{
        "internalType": "bool",
        "name": "",
        "type": "bool"
    }],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "address",
        "name": "account",
        "type": "address"
    }],
    "name": "isExcludedFromFees",
    "outputs": [{
        "internalType": "bool",
        "name": "",
        "type": "bool"
    }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "liquidityFee",
    "outputs": [{
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "marketingFee",
    "outputs": [{
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "name",
    "outputs": [{
        "internalType": "string",
        "name": "",
        "type": "string"
    }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "openTrading",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [],
    "name": "owner",
    "outputs": [{
        "internalType": "address",
        "name": "",
        "type": "address"
    }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "uint256",
        "name": "gas",
        "type": "uint256"
    }],
    "name": "processDividendTracker",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "address",
        "name": "pair",
        "type": "address"
    }, {
        "internalType": "bool",
        "name": "value",
        "type": "bool"
    }],
    "name": "setAutomatedMarketMakerPair",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
    }],
    "name": "setLiquiditFee",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
    }],
    "name": "setMATICRewardsFee",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
    }],
    "name": "setMarketingFee",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "address payable",
        "name": "wallet",
        "type": "address"
    }],
    "name": "setMarketingWallet",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [],
    "name": "swapTokensAtAmount",
    "outputs": [{
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "symbol",
    "outputs": [{
        "internalType": "string",
        "name": "",
        "type": "string"
    }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "totalFees",
    "outputs": [{
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "address",
        "name": "recipient",
        "type": "address"
    }, {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
    }],
    "name": "transfer",
    "outputs": [{
        "internalType": "bool",
        "name": "",
        "type": "bool"
    }],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "address",
        "name": "sender",
        "type": "address"
    }, {
        "internalType": "address",
        "name": "recipient",
        "type": "address"
    }, {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
    }],
    "name": "transferFrom",
    "outputs": [{
        "internalType": "bool",
        "name": "",
        "type": "bool"
    }],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
    }],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [],
    "name": "uniswapV2Pair",
    "outputs": [{
        "internalType": "address",
        "name": "",
        "type": "address"
    }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "uniswapV2Router",
    "outputs": [{
        "internalType": "contract IUniswapV2Router02",
        "name": "",
        "type": "address"
    }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "uint256",
        "name": "claimWait",
        "type": "uint256"
    }],
    "name": "updateClaimWait",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "address",
        "name": "newAddress",
        "type": "address"
    }],
    "name": "updateDividendTracker",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "uint256",
        "name": "newValue",
        "type": "uint256"
    }],
    "name": "updateGasForProcessing",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "address",
        "name": "newAddress",
        "type": "address"
    }],
    "name": "updateUniswapV2Router",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "address",
        "name": "account",
        "type": "address"
    }],
    "name": "withdrawableDividendOf",
    "outputs": [{
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }],
    "stateMutability": "view",
    "type": "function"
}, {
    "stateMutability": "payable",
    "type": "receive"
}]
const contract_address = '0xB2ce41B71D93D7f5878F985C3e1A87A6229019BE'

async function loadContract() {
    // Get a Web3 instance for the wallet
    
    if (!provider) {
        let w3 = new Web3(window.ethereum);
        // window.ethereum.enable();
        return await new w3.eth.Contract(ABI, contract_address);
    }
    else{
        web3 = new Web3(provider);
        return await new web3.eth.Contract(ABI, contract_address);
    }
}

let contract;


async function getTotalRewardsDistributed() {
    contract = await loadContract();
    
    const coolNumber = await contract.methods.getTotalDividendsDistributed().call();
    updateTotalRewards(`${(coolNumber*(10**-18)).toFixed(0)}+ $MATIC Rewards distributed so far!`);
}

function updateTotalRewards(status) {
    const statusEl = document.getElementById('total-rewards');
    statusEl.innerHTML = status;
}


function playVid() {
    var vid = document.getElementById("promo_video");
    vid.play();
} 

function pauseVid() {
    var vid = document.getElementById("promo_video");
    vid.pause();
} 

window.addEventListener('load', async () => {
    init();

    setTimeout(function() {
        $('#promo').modal('show');
        playVid();
}, 5000);

$("#promo").on("hidden.bs.modal", function () {
    // put your default event here
    pauseVid();
});
});
;
