export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function truncateAddress(addr: string): string {
  if (!addr || addr.length < 10) return addr
  return addr.slice(0, 6) + '...' + addr.slice(-4)
}

export function timeAgo(ts: number): string {
  const diff = Date.now() - ts
  if (diff < 60000) return 'Just now'
  if (diff < 3600000) return Math.floor(diff / 60000) + 'm ago'
  if (diff < 86400000) return Math.floor(diff / 3600000) + 'h ago'
  return Math.floor(diff / 86400000) + 'd ago'
}

export function readFileAsUint8Array(file: File): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(new Uint8Array(e.target?.result as ArrayBuffer))
    reader.onerror = reject
    reader.readAsArrayBuffer(file)
  })
}
