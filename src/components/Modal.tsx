import { ReactNode } from 'react'

interface Props {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  footer?: ReactNode
  maxWidth?: number
}

export default function Modal({ isOpen, onClose, title, children, footer, maxWidth = 480 }: Props) {
  if (!isOpen) return null
  return (
    <div onClick={e => { if (e.target === e.currentTarget) onClose() }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)', padding: '0 16px' }}>
      <div style={{ background: '#0F1117', border: '1px solid #1E2130', borderRadius: 12, width: '100%', maxWidth, maxHeight: '85vh', overflowY: 'auto', animation: 'slideUp 0.25s ease' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px', borderBottom: '1px solid #1E2130' }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: '#F0F2F5' }}>{title}</span>
          <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid #1E2130', background: 'transparent', color: '#8A93A2', cursor: 'pointer', fontSize: 16 }}>×</button>
        </div>
        <div style={{ padding: 20 }}>{children}</div>
        {footer && <div style={{ padding: '14px 20px', borderTop: '1px solid #1E2130', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>{footer}</div>}
      </div>
    </div>
  )
}
