import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import type { Toast, ToastType } from '../lib/types'

interface Ctx { showToast: (msg: string, type?: ToastType) => void }
const ToastCtx = createContext<Ctx>({ showToast: () => {} })
export const useToast = () => useContext(ToastCtx)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).slice(2)
    setToasts(p => [...p, { id, message, type }])
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500)
  }, [])

  const colors: Record<ToastType, string> = { success: '#22C55E', error: '#EF4444', info: '#3B82F6' }

  return (
    <ToastCtx.Provider value={{ showToast }}>
      {children}
      <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {toasts.map(t => (
          <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: '#161920', border: '1px solid #1E2130', borderRadius: 8, minWidth: 280, maxWidth: 360, boxShadow: '0 8px 24px rgba(0,0,0,0.4)', animation: 'slideUp 0.2s ease' }}>
            <div style={{ width: 18, height: 18, borderRadius: '50%', background: colors[t.type], display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 10, color: 'white', fontWeight: 700 }}>
              {t.type === 'success' ? '✓' : t.type === 'error' ? '✕' : 'i'}
            </div>
            <span style={{ flex: 1, fontSize: 13, color: '#F0F2F5' }}>{t.message}</span>
            <button onClick={() => setToasts(p => p.filter(x => x.id !== t.id))} style={{ background: 'none', border: 'none', color: '#4A5268', fontSize: 16, lineHeight: 1, padding: 0 }}>×</button>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}
