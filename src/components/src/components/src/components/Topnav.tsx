import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { truncateAddress } from '../lib/utils'

interface Props {
  onMenu: () => void
  onNewBackup: () => void
  onRestore: () => void
  onSearch: () => void
}

export default function Topnav({ onMenu, onNewBackup, onRestore, onSearch }: Props) {
  const { account, connected, connect, disconnect, wallets } = useWallet()

  const handleWallet = async () => {
    if (connected) { disconnect(); return }
    const petra = wallets?.find(w => w.name === 'Petra')
    if (petra) { try { await connect(petra.name) } catch (e) { console.error(e) } }
  }

  return (
    <nav style={{ height: 50, flexShrink: 0, background: '#0F1117', borderBottom: '1px solid #1E2130', display: 'flex', alignItems: 'center', gap: 10, padding: '0 20px' }}>
      <button onClick={onMenu} style={{ display: 'none', width: 32, height: 32, background: 'transparent', border: '1px solid #1E2130', borderRadius: 6, alignItems: 'center', justifyContent: 'center', color: '#8A93A2', flexShrink: 0, fontSize: 18 }} className="hamburger">☰</button>
      <button onClick={onSearch} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#06070A', border: '1px solid #1E2130', borderRadius: 7, padding: '6px 12px', width: 280, cursor: 'pointer', maxWidth: '40vw' }}>
        <span style={{ color: '#4A5268', fontSize: 13 }}>⌕</span>
        <span style={{ flex: 1, fontSize: 12.5, color: '#4A5268', textAlign: 'left' }}>Search anything...</span>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: '#4A5268', background: '#161920', border: '1px solid #1E2130', padding: '1px 5px', borderRadius: 3 }} className="hide-xs">⌘ K</span>
      </button>
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11.5, color: '#4A5268' }} className="hide-mobile">
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22C55E', animation: 'pulse 2s infinite' }} />
          Last sync: 2m ago
        </div>
        <button onClick={onRestore} className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: 6, height: 32, padding: '0 14px', borderRadius: 7, background: 'transparent', border: '1px solid #1E2130', fontSize: 12.5, fontWeight: 500, color: '#8A93A2' }}>
          ↩ Restore
        </button>
        <button onClick={onNewBackup} style={{ display: 'flex', alignItems: 'center', gap: 6, height: 32, padding: '0 14px', borderRadius: 7, background: '#FF4D8D', border: 'none', fontSize: 12.5, fontWeight: 600, color: '#fff', boxShadow: '0 0 16px rgba(255,77,141,0.28)', whiteSpace: 'nowrap' }}>
          + New Backup
        </button>
        <button onClick={handleWallet} style={{ display: 'flex', alignItems: 'center', gap: 6, height: 32, padding: '0 12px', borderRadius: 7, background: '#06070A', border: '1px solid #1E2130', fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#8A93A2', whiteSpace: 'nowrap' }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: connected ? '#22C55E' : '#4A5268' }} />
          {connected && account ? truncateAddress(account.address.toString()) : 'Connect'}
          <span style={{ color: '#4A5268', fontSize: 10 }}>▾</span>
        </button>
      </div>
      <style>{`
        .hamburger { display: none !important; }
        @media (max-width: 768px) {
          .hamburger { display: flex !important; }
          .hide-mobile { display: none !important; }
          .hide-xs { display: none !important; }
        }
      `}</style>
    </nav>
  )
      }
