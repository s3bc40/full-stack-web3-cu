import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { FaGithub } from "react-icons/fa";

export default function Header() {
  return (
    <header className="flex justify-between items-center p-4 bg-gray-100">
      {/* @dev rel="noopener noreferrer" == good security practices */}
      <a
        href="https://github.com/s3bc40/full-stack-web3-cu/tree/main/ts-tsender-ui-cu"
        target="_blank"
        rel="noopener noreferrer"
        className="text-black flex items-center"
      >
        <FaGithub className="mr-2 text-2xl" />
        <h1 className="text-black text-2xl font-black">tsender</h1>
      </a>
      <ConnectButton />
    </header>
  );
}
