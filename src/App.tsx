import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AptosWalletAdapterProvider } from '@aptos-labs/wallet-adapter-react'
import { Network } from '@aptos-labs/ts-sdk'
import { ToastProvider } from './components/Toast'
import Dashboard from './pages/Dashboard'

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 2, staleTime: 30_000 } },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AptosWalletAdapterProvider
        autoConnect={false}
        optInWallets={['Petra']}
        dappConfig={{
          network: Network.CUSTOM,
          aptosConnectDappId: 'shelbybackup',
        }}
        onError={(e) => console.error('Wallet error:', e)}
      >
        <ToastProvider>
          <Dashboard />
        </ToastProvider>
      </AptosWalletAdapterProvider>
    </QueryClientProvider>
  )
}
