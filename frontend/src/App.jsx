import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import useAuthStore from './store/useAuthStore'
import Layout from './components/layout/Layout'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import LibraryPage from './pages/LibraryPage'
import AddEntryPage from './pages/AddEntryPage'
import EntryDetailPage from './pages/EntryDetailPage'
import StatsPage from './pages/StatsPage'
import ProfilePage from './pages/ProfilePage'
import EditEntryPage from './pages/EditEntryPage'

// Protect routes — redirect to login if not authenticated
function PrivateRoute({ children }) {
  const { user } = useAuthStore()
  return user ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: '#1f2937', color: '#fff', border: '1px solid #374151' },
        }}
      />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected routes */}
        <Route path="/" element={<PrivateRoute><Layout><DashboardPage /></Layout></PrivateRoute>} />
        <Route path="/library" element={<PrivateRoute><Layout><LibraryPage /></Layout></PrivateRoute>} />
        <Route path="/library/add" element={<PrivateRoute><Layout><AddEntryPage /></Layout></PrivateRoute>} />
        <Route path="/library/:id" element={<PrivateRoute><Layout><EntryDetailPage /></Layout></PrivateRoute>} />
        <Route path="/library/:id/edit" element={<PrivateRoute><Layout><EditEntryPage /></Layout></PrivateRoute>} />
        <Route path="/stats" element={<PrivateRoute><Layout><StatsPage /></Layout></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Layout><ProfilePage /></Layout></PrivateRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
