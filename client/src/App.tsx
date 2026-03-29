import { Navigate, Route, Routes } from 'react-router-dom'
import BottomNav from './components/BottomNav.tsx'
import Navbar from './components/Navbar.tsx'
import ChatPage from './pages/ChatPage.tsx'
import DashboardPage from './pages/DashboardPage.tsx'
import LandingPage from './pages/LandingPage.tsx'
import LoginPage from './pages/LoginPage.tsx'
import SettingsPage from './pages/SettingsPage.tsx'

export default function App() {
  return (
    <div className="min-h-screen bg-appBgAlt font-sans text-textPrimary dark:bg-gray-950 dark:text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(900px_600px_at_20%_20%,rgba(255,107,0,0.10),transparent_60%)] dark:bg-[radial-gradient(900px_600px_at_20%_20%,rgba(255,107,0,0.18),transparent_55%)]" />
      <Navbar />
      <main className="page-fade-in relative mx-auto w-full max-w-6xl px-4 pb-24 pt-6 sm:px-6 md:pb-10 md:pt-20">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <BottomNav />
    </div>
  )
}
