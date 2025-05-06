import { createWalletClient, custom, createPublicClient, defineChain, parseEther, formatEther, PublicClient, WalletClient, getAddress } from "viem";
import "viem/window";
import { contractAddress, abi } from "./constants-ts";

const connectButton = document.getElementById('connect-button') as HTMLButtonElement;
const fundButton = document.getElementById('fund-button') as HTMLButtonElement;
const ethAmountInput = document.getElementById('eth-amount') as HTMLInputElement;
const balanceButton = document.getElementById('balance-button') as HTMLButtonElement;
const withdrawButton = document.getElementById('withdraw-button') as HTMLButtonElement;
const getAddressToAmountFundedButton = document.getElementById('get-address-to-amount-funded-button') as HTMLButtonElement;

let walletClient: WalletClient | undefined;
let publicClient: PublicClient | undefined;

async function connect(): Promise<void> {
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

async function fund(): Promise<void> {
    const ethAmount: string = ethAmountInput.value;
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
            chain: currentChain,
            value: parseEther(ethAmount),
        });

        if (walletClient) {
            const hash = await walletClient.writeContract(request);
            console.log(`Fund transaction hash: ${hash}`);
        }
    } else {
        connectButton.innerHTML = 'Please install MetaMask!';
    }
}

async function getCurrentChain(client: WalletClient): Promise<any> {
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


async function getBalance(): Promise<void> {
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

async function withdraw(): Promise<void> {
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
            chain: currentChain,
        });

        if (walletClient) {
            const hash = await walletClient.writeContract(request);
            console.log(`Withdraw transaction hash: ${hash}`);
        }
    } else {
        connectButton.innerHTML = 'Please install MetaMask!';
    }
}

async function getAddressToAmountFunded(): Promise<void> {
    if (typeof window.ethereum !== 'undefined') {
        walletClient = createWalletClient({
            transport: custom(window.ethereum)
        });

        const [connectedAccount] = await walletClient.requestAddresses();
        const currentChain = await getCurrentChain(walletClient);

        publicClient = createPublicClient({
            transport: custom(window.ethereum),
        });

        const data = await publicClient.readContract({
            address: contractAddress,
            abi,
            functionName: 'getAddressToAmountFunded',
            args: [connectedAccount],
        })

        console.log(`Address to amount funded: ${formatEther(data)} ETH`);
    }

}



connectButton.onclick = connect;
fundButton.onclick = fund;
balanceButton.onclick = getBalance;
withdrawButton.onclick = withdraw;
getAddressToAmountFundedButton.onclick = getAddressToAmountFunded;