"use client";
import { useEffect, useMemo, useState } from "react";
import InputField from "@/components/ui/InputField";
import { chainsToTSender, tsenderAbi, erc20Abi } from "@/constants";
import {
  useChainId,
  useConfig,
  useAccount,
  useWriteContract,
  useReadContracts,
} from "wagmi";
import { readContract, waitForTransactionReceipt } from "@wagmi/core";
import { calculateTotal } from "@/utils";
import TransferDetails from "./TransferDetails";

export default function AirDropForm() {
  const [tokenAddress, setTokenAddress] = useState("");
  const [recipients, setRecipients] = useState("");
  const [amounts, setAmounts] = useState("");
  const chainId = useChainId();
  const config = useConfig();
  const account = useAccount();
  // it's like `computed` in Vue
  const total: number = useMemo(() => calculateTotal(amounts), [amounts]);
  const { data: hash, isPending, writeContractAsync } = useWriteContract();
  const {
    data: tokenInfo,
    isLoading,
    isSuccess,
  } = useReadContracts({
    contracts: [
      {
        address: tokenAddress as `0x${string}`,
        abi: erc20Abi,
        functionName: "name",
      },
      {
        address: tokenAddress as `0x${string}`,
        abi: erc20Abi,
        functionName: "decimals",
      },
    ],
  });

  // ### EFFECTS ###
  // Effect to load values from localStorage ONLY on the client side
  // @dev order in useEffect matters!!!
  useEffect(() => {
    const savedTokenAddress = localStorage.getItem("tokenAddress");
    const savedRecipients = localStorage.getItem("recipients");
    const savedAmounts = localStorage.getItem("amounts");

    if (savedTokenAddress) {
      setTokenAddress(savedTokenAddress);
    }
    if (savedRecipients) {
      setRecipients(savedRecipients);
    }
    if (savedAmounts) {
      setAmounts(savedAmounts);
    }
  }, []);

  // Token Address
  useEffect(() => {
    // Add check for robustness
    localStorage.setItem("tokenAddress", tokenAddress);
  }, [tokenAddress]);

  useEffect(() => {
    // Add check for robustness
    localStorage.setItem("recipients", recipients);
  }, [recipients]);

  useEffect(() => {
    // Add check for robustness
    localStorage.setItem("amounts", amounts);
  }, [amounts]);

  // ### FUNCTIONS ###
  async function getApprovedAmount(
    tSenderAddress: string | undefined
  ): Promise<number> {
    if (!tSenderAddress) {
      alert(
        "No tSender address found for this chain, please use supported chain"
      );
      return 0;
    }
    // read the approved amount from the token contract
    const reponse = await readContract(config, {
      abi: erc20Abi,
      address: tokenAddress as `0x${string}`,
      functionName: "allowance",
      args: [account.address, tSenderAddress as `0x${string}`],
    });

    return reponse as number;
  }

  async function handleSubmit() {
    // 1a. If already approved, move to step 2
    // 1b. Approve our tsender contract to send our tokens
    // 2. Call the airdrop function on the tsender contract
    // 3. Wait for the transaction to be mined
    // 4. Show a success message
    const tSenderAddress = chainsToTSender[chainId]["tsender"];
    const approvedAmount = await getApprovedAmount(tSenderAddress);

    if (approvedAmount < total) {
      const approvalHash = await writeContractAsync({
        abi: erc20Abi,
        address: tokenAddress as `0x${string}`,
        functionName: "approve",
        args: [tSenderAddress as `0x${string}`, BigInt(total)],
      });

      const approvalReceipt = await waitForTransactionReceipt(config, {
        hash: approvalHash,
      });

      console.log("Approval confirmed", approvalReceipt);

      // @dev redundant
      await writeContractAsync({
        abi: tsenderAbi,
        address: tSenderAddress as `0x${string}`,
        functionName: "airdropERC20",
        args: [
          tokenAddress,
          // Comma or new line separated
          recipients
            .split(/[,\n]+/)
            .map((addr) => addr.trim())
            .filter((addr) => addr !== ""),
          amounts
            .split(/[,\n]+/)
            .map((amt) => amt.trim())
            .filter((amt) => amt !== ""),
          BigInt(total),
        ],
      });
    } else {
      await writeContractAsync({
        abi: tsenderAbi,
        address: tSenderAddress as `0x${string}`,
        functionName: "airdropERC20",
        args: [
          tokenAddress,
          // Comma or new line separated
          recipients
            .split(/[,\n]+/)
            .map((addr) => addr.trim())
            .filter((addr) => addr !== ""),
          amounts
            .split(/[,\n]+/)
            .map((amt) => amt.trim())
            .filter((amt) => amt !== ""),
          BigInt(total),
        ],
      });
    }
  }

  return (
    <div className="flex flex-col gap-4 p-8 mx-auto my-4 max-w-2xl border-1 dark:border-white border-gray-700 rounded-lg shadow-2xl dark:shadow-gray-800">
      {/* Input fields */}
      <InputField
        label="Token Address"
        placeholder="0x..."
        value={tokenAddress}
        onChange={(e) => setTokenAddress(e.target.value)}
      />
      <InputField
        label="Recipients"
        placeholder="0x1234,0x456789..."
        value={recipients}
        large
        onChange={(e) => setRecipients(e.target.value)}
      />
      <InputField
        label="Amount"
        placeholder="100,200..."
        value={amounts}
        large
        onChange={(e) => setAmounts(e.target.value)}
      />
      {/* Transfer details block */}
      {isSuccess &&
        typeof tokenAddress === "string" &&
        tokenAddress.startsWith("0x") &&
        tokenAddress.length === 42 && (
          <TransferDetails tokenAddress={tokenAddress} total={total} />
        )}

      <button
        className="flex gap-2 justify-center items-center bg-blue-500 text-white py-2 px-4 mx-auto rounded w-full"
        onClick={handleSubmit}
        disabled={isPending}
      >
        {/* Submit */}
        {isPending ? (
          <>
            <svg
              aria-hidden="true"
              className="w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <p>Loading...</p>
          </>
        ) : (
          <p>Submit</p>
        )}
        {/* Submit */}
      </button>
    </div>
  );
}
