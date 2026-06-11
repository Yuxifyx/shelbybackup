import { useState, useCallback, useRef } from 'react'
import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { useToast } from '../components/Toast'
import { readFileAsUint8Array } from '../lib/utils'
import type { BackupJob } from '../lib/types'

const INITIAL_JOBS: BackupJob[] = [
  { id: '1', fileName: 'wallet_activity_2025.json', fileSize: 148897792, filePath: '0x8c4a...ae7f / onchain', status: 'running', progress: 72, createdAt: Date.now() - 60000 },
  { id: '2', fileName: 'nft_metadata_batch.zip', fileSize: 39845888, filePath: '/nfts/collections/', status: 'done', progress: 100, blobId: 'bafy...9kzm', createdAt: Date.now() - 120000, completedAt: Date.now() - 60000 },
  { id: '3', fileName: 'defi_snapshot_q2.csv', fileSize: 88080384, filePath: '/analytics/snapshots/', status: 'queued', progress: 0, createdAt: Date.now() - 30000 },
  { id: '4', fileName: 'wallet_keys_encrypted.bin', fileSize: 2201600, filePath: '/secure/vault/', status: 'retry', progress: 28, createdAt: Date.now() - 90000 },
]

export function useJobs() {
  const [jobs, setJobs] = useState<BackupJob[]>(INITIAL_JOBS)
  const timers = useRef<Record<string, ReturnType<typeof setInterval>>>({})
  const { account, connected } = useWallet()
  const { showToast } = useToast()

  const updateJob = useCallback((id: string, patch: Partial<BackupJob>) => {
    setJobs(p => p.map(j => j.id === id ? { ...j, ...patch } : j))
  }, [])

  const simulateProgress = useCallback((id: string, startFrom = 0) => {
    if (timers.current[id]) clearInterval(timers.current[id])
    let p = startFrom
    timers.current[id] = setInterval(() => {
      p = Math.min(p + Math.random() * 5 + 2, 100)
      updateJob(id, { progress: Math.round(p) })
      if (p >= 100) {
        clearInterval(timers.current[id])
        delete timers.current[id]
        const blobId = 'bafy...' + Math.random().toString(36).slice(2, 8)
        updateJob(id, { status: 'done', progress: 100, completedAt: Date.now(), blobId })
        showToast('Backup completed successfully', 'success')
      }
    }, 350)
  }, [updateJob, showToast])

  const addJob = useCallback((file: File): string => {
    const id = Date.now().toString()
    const job: BackupJob = {
      id, fileName: file.name, fileSize: file.size,
      filePath: '/local/uploads/', status: 'queued',
      progress: 0, createdAt: Date.now(), file,
    }
    setJobs(p => [job, ...p])
    return id
  }, [])

  const startJob = useCallback(async (id: string) => {
    if (!connected || !account) {
      showToast('Please connect your Petra wallet first', 'error')
      return
    }
    const job = jobs.find(j => j.id === id)
    if (!job) return
    updateJob(id, { status: 'running', progress: 0, error: undefined })
    if (job.file) {
      try {
        showToast(`Uploading ${job.fileName} to Shelby...`, 'info')
        await readFileAsUint8Array(job.file)
        simulateProgress(id, 0)
      } catch (e: any) {
        updateJob(id, { status: 'retry', error: e.message })
        showToast(`Upload failed: ${e.message}`, 'error')
      }
    } else {
      simulateProgress(id, job.progress)
    }
  }, [jobs, connected, account, updateJob, simulateProgress, showToast])

  const pauseJob = useCallback((id: string) => {
    if (timers.current[id]) { clearInterval(timers.current[id]); delete timers.current[id] }
    updateJob(id, { status: 'paused' })
    showToast('Job paused', 'info')
  }, [updateJob, showToast])

  const resumeJob = useCallback((id: string) => {
    const job = jobs.find(j => j.id === id)
    if (!job) return
    updateJob(id, { status: 'running' })
    simulateProgress(id, job.progress)
    showToast('Job resumed', 'success')
  }, [jobs, updateJob, simulateProgress, showToast])

  const retryJob = useCallback((id: string) => {
    updateJob(id, { status: 'running', progress: 0, error: undefined })
    simulateProgress(id, 0)
    showToast('Retrying job...', 'info')
  }, [updateJob, simulateProgress, showToast])

  const removeJob = useCallback((id: string) => {
    if (timers.current[id]) { clearInterval(timers.current[id]); delete timers.current[id] }
    setJobs(p => p.filter(j => j.id !== id))
  }, [])

  const activeCount = jobs.filter(j => j.status === 'running' || j.status === 'queued' || j.status === 'retry').length

  return { jobs, addJob, startJob, pauseJob, resumeJob, retryJob, removeJob, activeCount }
      }
