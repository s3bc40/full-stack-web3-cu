"use client";
import { useMemo, useState } from "react";
import InputField from "@/components/ui/InputField";
import { chainsToTSender, tsenderAbi, erc20Abi } from "@/constants";
import { useChainId, useConfig, useAccount } from "wagmi";
import { readContract } from "@wagmi/core";
import { calculateTotal } from "@/utils";

export default function AirDropForm() {
  const [tokenAddress, setTokenAddress] = useState("");
  const [recipients, setRecipients] = useState("");
  const [amounts, setAmounts] = useState("");
  const chainId = useChainId();
  const config = useConfig();
  const account = useAccount();
  // it's like `computed` in Vue
  const total: number = useMemo(() => calculateTotal(amounts), [amounts]);

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

    // if (result < totalAmountNeed)
  }

  return (
    <div className="flex flex-col gap-4 p-4">
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
      <button
        className="bg-blue-500 text-white py-2 px-4 rounded max-w-xs"
        onClick={handleSubmit}
      >
        Submit
      </button>
    </div>
  );
}
