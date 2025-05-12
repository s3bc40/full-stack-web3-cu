"use client";
import Header from "@/components/Header";
import HomeContent from "@/components/HomeContent";
import { useAccount } from "wagmi";

export default function Home() {
  const { isConnected } = useAccount();

  return (
    <>
      <Header />
      {isConnected ? (
        <HomeContent />
      ) : (
        <div className="text-center text-2xl pt-2">
          Please connect your wallet
        </div>
      )}
    </>
  );
}
