import React from "react"
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit"
import { WagmiProvider } from "wagmi"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { sepolia } from "viem/chains"

const Web3Providers = ({children}) => {
  const config = getDefaultConfig({
    appName: "marketplaceerc721",
    projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID,
    chains: [sepolia],
    ssr: false
  })

  const queryClient = new QueryClient()
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default Web3Providers