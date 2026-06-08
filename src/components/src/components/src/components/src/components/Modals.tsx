import { useState, useRef } from 'react'
import Modal from './Modal'
import { useToast } from './Toast'
import { formatBytes } from '../lib/utils'

interface NewBackupProps { isOpen: boolean; onClose: () => void; onAdd: (file: File) => string; onStart: (id: string) => void }

export function NewBackupModal({ isOpen, onClose, onAdd, onStart }: NewBackupProps) {
  const [file, setFile] = useState<File | null>(null)
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const { showToast } = useToast()
  const handleFile = (f: File) => setFile(f)
  const handleSubmit = () => {
    if (!file) { showToast('Please select a file first', 'error'); return }
    const id = onAdd(file)
    onStart(id)
    showToast(`${file.name} queued for backup`, 'success')
    setFile(null)
    onClose()
  }
  const inputStyle = { width: '100%', background: '#06070A', border: '1px solid #1E2130', borderRadius: 7, padding: '9px 12px', fontSize: 13, color: '#F0F2F5', outline: 'none', fontFamily: 'inherit' }
  const selStyle = { ...inputStyle, cursor: 'pointer' }
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Backup Job"
      footer={<>
        <button onClick={onClose} style={{ height: 32, padding: '0 14px', borderRadius: 7, background: 'transparent', border: '1px solid #1E2130', fontSize: 12.5, color: '#8A93A2', cursor: 'pointer' }}>Cancel</button>
        <button onClick={handleSubmit} style={{ height: 32, padding: '0 16px', borderRadius: 7, background: '#FF4D8D', border: 'none', fontSize: 12.5, fontWeight: 600, color: '#fff', cursor: 'pointer' }}>Start Backup</button>
      </>}>
      <div onClick={() => fileRef.current?.click()} onDragOver={e => { e.preventDefault(); setDragging(true) }} onDragLeave={() => setDragging(false)} onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }}
        style={{ border: `1.5px dashed ${dragging ? '#FF4D8D' : '#1E2130'}`, borderRadius: 8, padding: 28, textAlign: 'center', cursor: 'pointer', background: dragging ? 'rgba(255,77,141,0.04)' : 'transparent', transition: 'all 0.2s', marginBottom: 16 }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>⬆</div>
        {file ? <div><div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>{file.name}</div><div style={{ fontSize: 11, color: '#4A5268' }}>{formatBytes(file.size)}</div></div>
          : <div><div style={{ fontSize: 13, color: '#8A93A2', marginBottom: 4 }}>Drop file here or click to browse</div><div style={{ fontSize: 11, color: '#4A5268' }}>All file types supported · Max 5 GB</div></div>}
        <input ref={fileRef} type="file" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        <div><label style={{ fontSize: 12, color: '#8A93A2', display: 'block', marginBottom: 6 }}>Destination</label><select style={selStyle}><option>Shelby Network</option><option>IPFS</option><option>Shelby + IPFS</option></select></div>
        <div><label style={{ fontSize: 12, color: '#8A93A2', display: 'block', marginBottom: 6 }}>Encryption</label><select style={selStyle}><option>AES-256 (Wallet Key)</option><option>No Encryption</option></select></div>
      </div>
      <div style={{ marginBottom: 12 }}><label style={{ fontSize: 12, color: '#8A93A2', display: 'block', marginBottom: 6 }}>Tags (optional)</label><input style={inputStyle} type="text" placeholder="e.g. wallet, nft, defi" /></div>
      <div><label style={{ fontSize: 12, color: '#8A93A2', display: 'block', marginBottom: 6 }}>Schedule</label><select style={selStyle}><option>One-time</option><option>Daily</option><option>Weekly</option><option>Monthly</option></select></div>
    </Modal>
  )
}

const RESTORE_ITEMS = [
  { id: '1', name: 'wallet_activity_2025.json', meta: 'bafy...xf8abj · 142 MB · Today', badge: 'Latest' },
  { id: '2', name: 'nft_metadata_batch.zip', meta: 'bafy...9kzm · 38 MB · Today', badge: 'Done' },
  { id: '3', name: 'defi_snapshot_q2.csv', meta: 'bafy...3mxq · 84 MB · Yesterday', badge: 'Done' },
]

export function RestoreModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [selected, setSelected] = useState<string | null>(null)
  const { showToast } = useToast()
  const inputStyle = { width: '100%', background: '#06070A', border: '1px solid #1E2130', borderRadius: 7, padding: '9px 12px', fontSize: 13, color: '#F0F2F5', outline: 'none', fontFamily: 'inherit', marginBottom: 14 }
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Restore Data"
      footer={<>
        <button onClick={onClose} style={{ height: 32, padding: '0 14px', borderRadius: 7, background: 'transparent', border: '1px solid #1E2130', fontSize: 12.5, color: '#8A93A2', cursor: 'pointer' }}>Cancel</button>
        <button onClick={() => { if (selected) { showToast('Restore initiated successfully', 'success'); onClose() } else showToast('Please select a file', 'error') }} style={{ height: 32, padding: '0 16px', borderRadius: 7, background: '#FF4D8D', border: 'none', fontSize: 12.5, fontWeight: 600, color: '#fff', cursor: 'pointer' }}>Restore Selected</button>
      </>}>
      <input style={inputStyle} type="text" placeholder="Search by filename, date, or CID..." />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {RESTORE_ITEMS.map(item => (
          <div key={item.id} onClick={() => setSelected(item.id)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: '#161920', border: `1px solid ${selected === item.id ? '#FF4D8D' : '#1E2130'}`, borderRadius: 7, cursor: 'pointer', transition: 'border-color 0.15s' }}>
            <span style={{ fontSize: 18, color: '#8A93A2' }}>⊡</span>
            <div style={{ flex: 1 }}><div style={{ fontSize: 12.5, fontWeight: 500 }}>{item.name}</div><div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: '#4A5268', marginTop: 2 }}>{item.meta}</div></div>
            <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, background: 'rgba(34,197,94,0.1)', color: '#22C55E' }}>{item.badge}</span>
          </div>
        ))}
      </div>
    </Modal>
  )
}

export function VerifyModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [running, setRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)
  const [log, setLog] = useState('')
  const { showToast } = useToast()
  const run = () => {
    setRunning(true); setDone(false); setProgress(0)
    const msgs = ['Verifying CID hashes...', 'Checking replication factor...', 'Validating blob integrity...', 'Cross-referencing index...', 'All checks passed']
    let p = 0; let m = 0
    const t = setInterval(() => {
      p = Math.min(p + Math.random() * 8 + 4, 100)
      setProgress(Math.round(p))
      if (m < msgs.length - 1 && p / 100 > (m + 1) / msgs.length) setLog(msgs[++m])
      if (p >= 100) { clearInterval(t); setRunning(false); setDone(true); setLog(msgs[msgs.length - 1]); showToast('All integrity checks passed', 'success') }
    }, 150)
  }
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Verify Data Integrity"
      footer={<>
        <button onClick={onClose} style={{ height: 32, padding: '0 14px', borderRadius: 7, background: 'transparent', border: '1px solid #1E2130', fontSize: 12.5, color: '#8A93A2', cursor: 'pointer' }}>Cancel</button>
        <button onClick={run} disabled={running} style={{ height: 32, padding: '0 16px', borderRadius: 7, background: '#FF4D8D', border: 'none', fontSize: 12.5, fontWeight: 600, color: '#fff', cursor: running ? 'wait' : 'pointer', opacity: running ? 0.7 : 1 }}>{running ? 'Verifying...' : 'Run Verification'}</button>
      </>}>
      <p style={{ fontSize: 13, color: '#8A93A2', marginBottom: 16 }}>Run integrity checks on all stored blobs. This verifies CID hashes and replication status across all nodes.</p>
      {(running || done) && <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 12, color: '#8A93A2', marginBottom: 8 }}>Checking {Math.round(progress * 14.82)} / 1,482 blobs...</div>
        <div style={{ height: 6, background: '#1E2130', borderRadius: 3, overflow: 'hidden', marginBottom: 8 }}><div style={{ height: '100%', width: `${progress}%`, background: '#22C55E', borderRadius: 3, transition: 'width 0.3s' }} /></div>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#4A5268' }}>{log}</div>
      </div>}
      {done && <div style={{ padding: 12, background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 8 }}>
        <div style={{ fontSize: 13, color: '#22C55E', fontWeight: 500, marginBottom: 4 }}>All checks passed</div>
        <div style={{ fontSize: 11.5, color: '#8A93A2' }}>1,482 blobs verified · 0 errors · Avg replication 3.1x</div>
      </div>}
    </Modal>
  )
}

export function ManageKeysModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { showToast } = useToast()
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Manage Keys"
      footer={<button onClick={onClose} style={{ height: 32, padding: '0 16px', borderRadius: 7, background: '#FF4D8D', border: 'none', fontSize: 12.5, fontWeight: 600, color: '#fff', cursor: 'pointer' }}>Done</button>}>
      <div style={{ padding: '12px 14px', background: '#161920', border: '1px solid #1E2130', borderRadius: 8, marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: '#4A5268', marginBottom: 4 }}>Primary Encryption Key</div>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>Derived from wallet · AES-256-GCM</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[{ label: '⊡ Export Backup Key', danger: false, action: () => showToast('Key copied to clipboard', 'success') }, { label: '↺ Re-encrypt All Backups', danger: false, action: () => showToast('Re-encryption started', 'info') }, { label: '✕ Revoke Old Keys', danger: true, action: () => showToast('Old keys revoked', 'info') }].map((btn, i) => (
          <button key={i} onClick={btn.action} style={{ display: 'flex', alignItems: 'center', gap: 8, height: 40, padding: '0 14px', borderRadius: 7, background: btn.danger ? 'rgba(239,68,68,0.08)' : 'transparent', border: `1px solid ${btn.danger ? 'rgba(239,68,68,0.3)' : '#1E2130'}`, fontSize: 13, color: btn.danger ? '#EF4444' : '#8A93A2', cursor: 'pointer', textAlign: 'left' }}>{btn.label}</button>
        ))}
      </div>
    </Modal>
  )
}

const SEARCH_DATA = ['wallet_activity_2025.json · 142 MB · Running', 'nft_metadata_batch.zip · 38 MB · Done', 'defi_snapshot_q2.csv · 84 MB · Queued', 'wallet_keys_encrypted.bin · 2.1 MB · Retry', 'Wallet Activity Daily · Schedule · Every 24h', 'NFT Collections Weekly · Schedule · Every 7d', 'DeFi Position Snapshot · Schedule · Every 6h', 'bafy...xf8abj · CID · wallet_activity_2025.json', 'bafy...9kzm · CID · nft_metadata_batch.zip']

export function SearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [q, setQ] = useState('')
  const { showToast } = useToast()
  const results = q ? SEARCH_DATA.filter(r => r.toLowerCase().includes(q.toLowerCase())) : []
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Search" maxWidth={540}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 14, borderBottom: '1px solid #1E2130', marginBottom: 14, marginTop: -4 }}>
        <span style={{ color: '#4A5268', fontSize: 16 }}>⌕</span>
        <input autoFocus value={q} onChange={e => setQ(e.target.value)} placeholder="Search jobs, archives, CIDs..." style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: 14, color: '#F0F2F5', fontFamily: 'inherit' }} />
        {q && <button onClick={() => setQ('')} style={{ background: 'none', border: 'none', color: '#4A5268', cursor: 'pointer', fontSize: 16 }}>×</button>}
      </div>
      {!q && <div style={{ textAlign: 'center', color: '#4A5268', fontSize: 13, padding: '20px 0' }}>Start typing to search...</div>}
      {q && results.length === 0 && <div style={{ textAlign: 'center', color: '#4A5268', fontSize: 13, padding: '20px 0' }}>No results found</div>}
      {results.map((r, i) => { const parts = r.split(' · '); return (
        <div key={i} onClick={() => { onClose(); showToast(`Opened: ${parts[0]}`, 'info') }} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px', borderRadius: 7, cursor: 'pointer', transition: 'background 0.1s' }} onMouseEnter={e => (e.currentTarget.style.background = '#161920')} onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
          <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 500 }}>{parts[0]}</div><div style={{ fontSize: 11, color: '#4A5268', marginTop: 2 }}>{parts.slice(1).join(' · ')}</div></div>
        </div>
      )})}
    </Modal>
  )
}

export function AddScheduleModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { showToast } = useToast()
  const inputStyle = { width: '100%', background: '#06070A', border: '1px solid #1E2130', borderRadius: 7, padding: '9px 12px', fontSize: 13, color: '#F0F2F5', outline: 'none', fontFamily: 'inherit' }
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Backup Schedule"
      footer={<>
        <button onClick={onClose} style={{ height: 32, padding: '0 14px', borderRadius: 7, background: 'transparent', border: '1px solid #1E2130', fontSize: 12.5, color: '#8A93A2', cursor: 'pointer' }}>Cancel</button>
        <button onClick={() => { showToast('Schedule created successfully', 'success'); onClose() }} style={{ height: 32, padding: '0 16px', borderRadius: 7, background: '#FF4D8D', border: 'none', fontSize: 12.5, fontWeight: 600, color: '#fff', cursor: 'pointer' }}>Create Schedule</button>
      </>}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div><label style={{ fontSize: 12, color: '#8A93A2', display: 'block', marginBottom: 6 }}>Schedule Name</label><input style={inputStyle} placeholder="e.g. Daily Wallet Backup" /></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div><label style={{ fontSize: 12, color: '#8A93A2', display: 'block', marginBottom: 6 }}>Frequency</label><select style={{ ...inputStyle, cursor: 'pointer' }}><option>Every hour</option><option>Every 6 hours</option><option>Daily</option><option>Weekly</option></select></div>
          <div><label style={{ fontSize: 12, color: '#8A93A2', display: 'block', marginBottom: 6 }}>Mode</label><select style={{ ...inputStyle, cursor: 'pointer' }}><option>Full snapshot</option><option>Delta only</option><option>Incremental</option></select></div>
        </div>
        <div><label style={{ fontSize: 12, color: '#8A93A2', display: 'block', marginBottom: 6 }}>Source</label><select style={{ ...inputStyle, cursor: 'pointer' }}><option>Wallet Data</option><option>Onchain Activity</option><option>Local Files</option><option>IPFS</option></select></div>
        <div><label style={{ fontSize: 12, color: '#8A93A2', display: 'block', marginBottom: 6 }}>Encryption</label><select style={{ ...inputStyle, cursor: 'pointer' }}><option>AES-256 (Wallet Key)</option><option>No Encryption</option></select></div>
      </div>
    </Modal>
  )
    }
