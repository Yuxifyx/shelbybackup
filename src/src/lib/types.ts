export interface BackupJob {
  id: string
  fileName: string
  fileSize: number
  filePath: string
  status: 'queued' | 'running' | 'done' | 'retry' | 'paused'
  progress: number
  blobId?: string
  createdAt: number
  completedAt?: number
  error?: string
  file?: File
}

export interface BlobRecord {
  blobId: string
  name: string
  size: number
  createdAt: number
}

export interface Schedule {
  id: string
  name: string
  frequency: string
  mode: string
  source: string
  enabled: boolean
  nextRun: string
}

export type ToastType = 'success' | 'error' | 'info'
export interface Toast { id: string; message: string; type: ToastType }
