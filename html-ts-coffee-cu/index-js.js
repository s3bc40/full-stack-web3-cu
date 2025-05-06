import { createWalletClient, custom, createPublicClient, defineChain, parseEther, formatEther } from 'https://esm.sh/viem'
import { contractAddress, abi } from './constants-js.js';

const connectButton = document.getElementById('connect-button');
const fundButton = document.getElementById('fund-button');
const ethAmountInput = document.getElementById('eth-amount');
const balanceButton = document.getElementById('balance-button');
const withdrawButton = document.getElementById('withdraw-button');

let walletClient;
let publicClient;

async function connect() {
    if (typeof window.ethereum !== 'undefined') {
        console.log("Connecting using viem...");

        walletClient = createWalletClient({
            transport: custom(window.ethereum),
        });

        await walletClient.requestAddresses();
        connectButton.innerHTML = "Connected to wallet!";
    } else {
        connectButton.innerHTML = 'Please install MetaMask!';
    }
}

async function fund() {
    const ethAmount = ethAmountInput.value;
    console.log(`Funding with ${ethAmount} ETH...`);

    if (typeof window.ethereum !== 'undefined') {
        walletClient = createWalletClient({
            transport: custom(window.ethereum),
        });

        const [connectedAccount] = await walletClient.requestAddresses();
        const currentChain = await getCurrentChain(walletClient);
        
        publicClient = createPublicClient({
            transport: custom(window.ethereum),
        });

        const { request } = await publicClient.simulateContract({
            address: contractAddress,
            abi,
            functionName: 'fund',
            account: connectedAccount,
            chain:currentChain,
            value:parseEther(ethAmount),
        });

        const hash = await walletClient.writeContract(request);
        console.log(`Fund transaction hash: ${hash}`);
    } else {
        connectButton.innerHTML = 'Please install MetaMask!';
    }
}

async function getCurrentChain(client) {
    const chainId = await client.getChainId()
    const currentChain = defineChain({
      id: chainId,
      name: "Custom Chain",
      nativeCurrency: {
        name: "Ether",
        symbol: "ETH",
        decimals: 18,
      },
      rpcUrls: {
        default: {
          http: ["http://localhost:8545"],
        },
      },
    })
    return currentChain
  }

  
async function getBalance() {
    if (typeof window.ethereum !== 'undefined') {
        console.log("Connecting using viem...");

        publicClient = createPublicClient({
            transport: custom(window.ethereum),
        });

        const balance = await publicClient.getBalance({
            address: contractAddress,
        })
        console.log(`Balance: ${formatEther(balance)} ETH`);
    }
}

async function withdraw() {
    if (typeof window.ethereum !== 'undefined') {
        walletClient = createWalletClient({
            transport: custom(window.ethereum),
        });

        const [connectedAccount] = await walletClient.requestAddresses();
         const currentChain = await getCurrentChain(walletClient);
        
        publicClient = createPublicClient({
            transport: custom(window.ethereum),
        });

        const { request } = await publicClient.simulateContract({
            address: contractAddress,
            abi,
            functionName: 'withdraw',
            account: connectedAccount,
            chain:currentChain,
        });

        const hash = await walletClient.writeContract(request);
        console.log(`Withdraw transaction hash: ${hash}`);
    } else {
        connectButton.innerHTML = 'Please install MetaMask!';
    }
}



connectButton.onclick = connect;
fundButton.onclick = fund;
balanceButton.onclick = getBalance;
withdrawButton.onclick = withdraw;