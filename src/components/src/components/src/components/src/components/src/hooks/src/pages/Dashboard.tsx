import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import Topnav from '../components/Topnav'
import Overview from './Overview'
import JobQueue from './JobQueue'
import Archives from './Archives'
import Schedules from './Schedules'
import WalletData from './WalletData'
import Encryption from './Encryption'
import Config from './Config'
import { NewBackupModal, RestoreModal, VerifyModal, ManageKeysModal, SearchModal, AddScheduleModal } from '../components/Modals'
import { useJobs } from '../hooks/useJobs'

type Page = 'overview' | 'jobs' | 'schedules' | 'archives' | 'wallet' | 'onchain' | 'files' | 'ipfs' | 'encryption' | 'config'

export default function Dashboard() {
  const [page, setPage] = useState<Page>('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [modal, setModal] = useState<'newbackup' | 'restore' | 'verify' | 'keys' | 'search' | 'schedule' | null>(null)

  const { jobs, addJob, startJob, pauseJob, resumeJob, retryJob, removeJob, activeCount } = useJobs()

  const openModal = (m: typeof modal) => setModal(m)
  const closeModal = () => setModal(null)

  const renderPage = () => {
    switch (page) {
      case 'overview':
        return (
          <Overview
            jobs={jobs}
            onNewBackup={() => openModal('newbackup')}
            onRestore={() => openModal('restore')}
            onVerify={() => openModal('verify')}
            onManageKeys={() => openModal('keys')}
          />
        )
      case 'jobs':
        return (
          <JobQueue
            jobs={jobs}
            onStart={startJob}
            onPause={pauseJob}
            onResume={resumeJob}
            onRetry={retryJob}
            onRemove={removeJob}
            onNewBackup={() => openModal('newbackup')}
          />
        )
      case 'schedules':
        return <Schedules onAdd={() => openModal('schedule')} />
      case 'archives':
        return <Archives onRestore={() => openModal('restore')} />
      case 'wallet':
        return <WalletData />
      case 'encryption':
        return <Encryption />
      case 'config':
        return <Config />
      default:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, color: '#4A5268', gap: 12 }}>
            <div style={{ fontSize: 40 }}>◈</div>
            <div style={{ fontSize: 14, fontWeight: 500 }}>Coming Soon</div>
            <div style={{ fontSize: 13 }}>This section is under development</div>
          </div>
        )
    }
  }

  return (
    <>
      <div style={{ display: 'flex', minHeight: '100vh' }} className="app-root">
        <Sidebar
          active={page}
          onNav={(p) => setPage(p as Page)}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          jobCount={activeCount}
        />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, minHeight: 0 }}>
          <Topnav
            onMenu={() => setSidebarOpen(true)}
            onNewBackup={() => openModal('newbackup')}
            onRestore={() => openModal('restore')}
            onSearch={() => openModal('search')}
          />
          <main style={{ flex: 1, overflowY: 'auto', padding: '20px 22px' }} className="main-content">
            {renderPage()}
          </main>
        </div>
      </div>

      <NewBackupModal isOpen={modal === 'newbackup'} onClose={closeModal} onAdd={addJob} onStart={startJob} />
      <RestoreModal isOpen={modal === 'restore'} onClose={closeModal} />
      <VerifyModal isOpen={modal === 'verify'} onClose={closeModal} />
      <ManageKeysModal isOpen={modal === 'keys'} onClose={closeModal} />
      <SearchModal isOpen={modal === 'search'} onClose={closeModal} />
      <AddScheduleModal isOpen={modal === 'schedule'} onClose={closeModal} />

      <style>{`
        @media (min-width: 769px) {
          .app-root { height: 100vh; overflow: hidden; }
          .app-root > aside { height: 100vh; }
          .app-root > div { height: 100vh; overflow: hidden; }
          .main-content { overflow-y: auto !important; padding-bottom: 40px !important; }
        }
        @media (max-width: 768px) {
          .app-root { flex-direction: column; height: auto; min-height: 100vh; }
          .main-content { overflow: visible !important; padding: 14px 14px 80px !important; }
        }
        @media (max-width: 480px) {
          .main-content { padding: 12px 12px 80px !important; }
        }
      `}</style>
    </>
  )
}
