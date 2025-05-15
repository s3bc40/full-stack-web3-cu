"use client"

import { useAccount } from "wagmi"
import RecentlyListedNFTs from "@/components/RecentlyListed"
import { useState, useEffect } from "react"

export default function Home() {
    const { isConnected, address } = useAccount()
    const [isCompliant, setIsCompliant] = useState(true)

    async function checkCompliance() {
        if (!address) return

        // setIsCheckingCompliance(true)

        try {
            const response = await fetch("/api/compliance", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ address }),
            })

            const result = await response.json()
            setIsCompliant(result.success && result.isApproved)
        } catch (error) {
            console.error("Compliance check error:", error)
            // setIsCompliant(false)
        } finally {
            // setIsCheckingCompliance(false)
        }
    }

    useEffect(() => {
        if (address) {
            checkCompliance()
        }
    }, [address])

    return (
        <main>
            {!isConnected ? (
                // Prompt user to connect if they haven't
                <div>Please connect your wallet to continue.</div>
            ) : // User is connected, now check compliance status
            isCompliant ? (
                // Compliant: Render the main application content
                <div>
                    <h1>Welcome to the App!</h1>
                    <RecentlyListedNFTs />
                </div>
            ) : (
                // Not Compliant: Show a denial message
                <div>
                    <h1>Access Denied</h1>
                    <p>
                        Your connected wallet address is not permitted to use this application
                        based on compliance checks.
                    </p>
                </div>
            )}
        </main>
    )
}
