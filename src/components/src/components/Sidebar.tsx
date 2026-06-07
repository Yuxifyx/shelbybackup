import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { truncateAddress } from '../lib/utils'

const NAV = [
  { id: 'overview', label: 'Overview', icon: '⊞', section: 'MAIN' },
  { id: 'jobs', label: 'Job Queue', icon: '☰', section: 'MAIN', badge: true },
  { id: 'schedules', label: 'Schedules', icon: '◷', section: 'MAIN' },
  { id: 'archives', label: 'Archives', icon: '◈', section: 'MAIN' },
  { id: 'wallet', label: 'Wallet Data', icon: '◫', section: 'DATA' },
  { id: 'onchain', label: 'Onchain Activity', icon: '⊕', section: 'DATA' },
  { id: 'files', label: 'Local Files', icon: '⊡', section: 'DATA' },
  { id: 'ipfs', label: 'IPFS Import', icon: '⇄', section: 'DATA' },
  { id: 'encryption', label: 'Encryption', icon: '⊠', section: 'SETTINGS' },
  { id: 'config', label: 'Configuration', icon: '⊙', section: 'SETTINGS' },
]

interface Props {
  active: string
  onNav: (p: string) => void
  isOpen: boolean
  onClose: () => void
  jobCount: number
}

export default function Sidebar({ active, onNav, isOpen, onClose, jobCount }: Props) {
  const { account, connected, disconnect } = useWallet()
  const isMobile = window.innerWidth <= 768

  return (
    <>
      {isMobile && isOpen && (
        <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 350, backdropFilter: 'blur(2px)' }} />
      )}
      <aside style={{
        width: 210, minWidth: 210, background: '#0F1117', borderRight: '1px solid #1E2130',
        display: 'flex', flexDirection: 'column', flexShrink: 0, overflowY: 'auto',
        ...(isMobile ? {
          position: 'fixed', top: 0, left: 0, bottom: 0, height: '100%', zIndex: 400,
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
          boxShadow: isOpen ? '4px 0 24px rgba(0,0,0,0.6)' : 'none',
        } : {}),
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '18px 16px', borderBottom: '1px solid #1E2130', flexShrink: 0 }}>
          <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg,#FF4D8D,#c41560)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 0 18px rgba(255,77,141,0.35)', fontSize: 16, color: 'white' }}>⊠</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#F0F2F5' }}>ShelbyBackup</div>
            <div style={{ fontSize: 10, color: '#4A5268' }}>Decentralized Backup</div>
          </div>
          {isMobile && <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#4A5268', fontSize: 18, padding: 0, cursor: 'pointer' }}>×</button>}
        </div>

        <nav style={{ flex: 1, padding: '8px 0', overflowY: 'auto' }}>
          {['MAIN', 'DATA', 'SETTINGS'].map(section => (
            <div key={section}>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#4A5268', padding: '14px 16px 5px', fontFamily: 'JetBrains Mono, monospace' }}>{section}</div>
              {NAV.filter(n => n.section === section).map(item => {
                const isActive = active === item.id
                return (
                  <button key={item.id} onClick={() => { onNav(item.id); if (isMobile) onClose() }}
                    style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '8px 10px 8px 14px', margin: '1px 8px', borderRadius: 7, width: 'calc(100% - 16px)', fontSize: 13, color: isActive ? '#FF4D8D' : '#8A93A2', background: isActive ? 'rgba(255,77,141,0.12)' : 'transparent', border: isActive ? '1px solid rgba(255,77,141,0.2)' : '1px solid transparent', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}>
                    <span style={{ fontSize: 15, width: 16, textAlign: 'center' }}>{item.icon}</span>
                    <span style={{ flex: 1 }}>{item.label}</span>
                    {item.badge && jobCount > 0 && (
                      <span style={{ background: '#FF4D8D', color: '#fff', fontSize: 9, fontWeight: 700, minWidth: 17, height: 17, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px' }}>{jobCount}</span>
                    )}
                  </button>
                )
              })}
              <div style={{ height: 1, background: '#1E2130', margin: '6px 0' }} />
            </div>
          ))}
        </nav>

        <div style={{ padding: '12px 14px', borderTop: '1px solid #1E2130', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#22C55E', boxShadow: '0 0 6px #22C55E', animation: 'pulse 2.5s infinite' }} />
            <span style={{ fontSize: 12, fontWeight: 500, color: '#F0F2F5' }}>Network Status</span>
          </div>
          <div style={{ fontSize: 10.5, color: '#4A5268', marginBottom: 6 }}>Shelbynet — Testnet</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#8A93A2', marginBottom: 2 }}>
            <span>Active Nodes</span><span style={{ color: '#F0F2F5', fontWeight: 500 }}>128</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#8A93A2' }}>
            <span>Online</span><span style={{ color: '#F0F2F5', fontWeight: 500 }}>125 (97.6%)</span>
          </div>
        </div>

        <div onClick={() => connected && disconnect()} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '12px 14px', borderTop: '1px solid #1E2130', cursor: connected ? 'pointer' : 'default', flexShrink: 0 }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: connected ? 'linear-gradient(135deg,#FF4D8D,#A855F7)' : '#161920', border: '1px solid #1E2130', flexShrink: 0 }} />
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#F0F2F5', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {connected && account ? truncateAddress(account.address.toString()) : 'Not connected'}
            </div>
            <div style={{ fontSize: 10, color: '#4A5268' }}>{connected ? 'Administrator' : 'Connect wallet'}</div>
          </div>
          <span style={{ color: '#4A5268', fontSize: 11 }}>▾</span>
        </div>
      </aside>
    </>
  )
                           }
