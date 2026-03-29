import { Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import ChatPage from './pages/ChatPage'
import DashboardPage from './pages/DashboardPage'
import LandingPage from './pages/LandingPage'

export default function App() {
  return (
    <div className="min-h-screen bg-[#0b0d12] text-slate-100">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(900px_600px_at_20%_20%,rgba(255,107,0,0.14),transparent_55%),radial-gradient(900px_600px_at_80%_10%,rgba(255,107,0,0.08),transparent_60%)]" />
      <Navbar />
      <main className="relative mx-auto w-full max-w-6xl px-4 pb-10 pt-20 sm:px-6">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}
