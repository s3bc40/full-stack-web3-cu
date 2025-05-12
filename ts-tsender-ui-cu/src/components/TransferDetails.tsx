import { useReadContracts } from "wagmi";
import { erc20Abi } from "@/constants";

export default function TransferDetails({
  tokenAddress,
  total,
}: {
  tokenAddress: string | undefined;
  total: number | undefined;
}) {
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
  return (
    <div className="flex flex-col gap-2 p-4 border-1 rounded-lg">
      <p className="text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
        Transaction Details
      </p>
      {/* Token name */}
      <div className="flex justify-between">
        <p className="text-gray-700 dark:text-gray-300">Token Name</p>
        <p className="text-gray-700 dark:text-gray-300">
          {isLoading ? (
            <span className="animate-pulse">Loading...</span>
          ) : tokenInfo?.[0].result ? (
            (tokenInfo?.[0].result as string)
          ) : (
            "N/A"
          )}
        </p>
      </div>
      {/* Amount in wei */}
      <div className="flex justify-between">
        <p className="text-gray-700 dark:text-gray-300">Amount in wei</p>
        <p className="text-gray-700 dark:text-gray-300">{total || "N/A"}</p>
      </div>
      {/* Amount in tokens */}
      <div className="flex justify-between">
        <p className="text-gray-700 dark:text-gray-300">Amount in tokens</p>
        <p className="text-gray-700 dark:text-gray-300">
          {isLoading ? (
            <span className="animate-pulse">Loading...</span>
          ) : tokenInfo?.[1].result && total ? (
            (total / 10 ** (tokenInfo?.[1].result as number)).toFixed(2)
          ) : (
            "N/A"
          )}
        </p>
      </div>
    </div>
  );
}
