import { Link, useNavigate } from 'react-router-dom'
import { FiLogOut, FiUser } from 'react-icons/fi'
import useAuthStore from '../../store/useAuthStore'

export default function Navbar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
      <Link to="/" className="text-2xl font-bold text-indigo-400 tracking-tight">
        Media<span className="text-white">Nest</span>
      </Link>

      <div className="flex items-center gap-6">
        <Link to="/" className="text-gray-300 hover:text-white transition-colors text-sm">Dashboard</Link>
        <Link to="/library" className="text-gray-300 hover:text-white transition-colors text-sm">Library</Link>
        <Link to="/stats" className="text-gray-300 hover:text-white transition-colors text-sm">Stats</Link>

        <div className="flex items-center gap-3 ml-4 border-l border-gray-700 pl-4">
          <Link to="/profile" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-sm">
            <FiUser size={16} />
            <span>{user?.username}</span>
          </Link>
          <button
            onClick={handleLogout}
            className="text-gray-400 hover:text-red-400 transition-colors"
            title="Logout"
          >
            <FiLogOut size={18} />
          </button>
        </div>
      </div>
    </nav>
  )
}
