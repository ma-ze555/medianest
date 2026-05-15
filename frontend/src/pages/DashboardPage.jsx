import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import useMediaStore from '../store/useMediaStore'
import useAuthStore from '../store/useAuthStore'
import { FiTv, FiFilm, FiMusic, FiBook, FiPlus } from 'react-icons/fi'

const CATEGORY_META = {
  anime: { label: 'Anime', icon: FiTv, color: 'text-pink-400', bg: 'bg-pink-400/10' },
  movie: { label: 'Movies', icon: FiFilm, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  series: { label: 'Series', icon: FiTv, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  music: { label: 'Music', icon: FiMusic, color: 'text-green-400', bg: 'bg-green-400/10' },
  novel: { label: 'Novels', icon: FiBook, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
}

export default function DashboardPage() {
  const { entries, stats, fetchEntries, fetchStats } = useMediaStore()
  const { user } = useAuthStore()

  useEffect(() => {
    fetchEntries({ status: 'in_progress' })
    fetchStats()
  }, [])

  // Count completed per category from stats
  const completedByCategory = {}
  if (stats?.stats) {
    stats.stats.forEach(({ _id, count }) => {
      if (_id.status === 'completed') {
        completedByCategory[_id.category] = count
      }
    })
  }

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-3xl font-bold text-white">
          Welcome back, <span className="text-indigo-400">{user?.username}</span>
        </h1>
        <p className="text-gray-400 mt-1">Here's what's going on in your nest.</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Object.entries(CATEGORY_META).map(([key, meta]) => {
          const Icon = meta.icon
          return (
            <Link
              to={`/library?category=${key}`}
              key={key}
              className={`${meta.bg} border border-gray-800 rounded-xl p-4 hover:border-gray-600 transition-colors`}
            >
              <Icon className={`${meta.color} mb-2`} size={22} />
              <p className="text-2xl font-bold text-white">{completedByCategory[key] || 0}</p>
              <p className="text-gray-400 text-sm">{meta.label} completed</p>
            </Link>
          )
        })}
      </div>

      {/* In Progress */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">In Progress</h2>
          <Link
            to="/library/add"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded-lg transition-colors"
          >
            <FiPlus size={16} /> Add New
          </Link>
        </div>

        {entries.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <p className="text-lg">Nothing in progress yet.</p>
            <Link to="/library/add" className="text-indigo-400 hover:underline text-sm mt-2 inline-block">
              Add something to get started
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {entries.map((entry) => (
              <MediaCard key={entry._id} entry={entry} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function MediaCard({ entry }) {
  const meta = CATEGORY_META[entry.category]
  const Icon = meta?.icon || FiTv
  const progress =
    entry.progress?.total > 0
      ? Math.round((entry.progress.current / entry.progress.total) * 100)
      : null

  return (
    <Link
      to={`/library/${entry._id}`}
      className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-600 transition-colors group"
    >
      {entry.coverImage ? (
        <img
          src={entry.coverImage}
          alt={entry.title}
          className="w-full h-40 object-cover group-hover:opacity-90 transition-opacity"
        />
      ) : (
        <div className="w-full h-40 bg-gray-800 flex items-center justify-center">
          <Icon size={32} className={meta?.color || 'text-gray-500'} />
        </div>
      )}
      <div className="p-3">
        <p className="text-white text-sm font-medium truncate">{entry.title}</p>
        <p className={`text-xs mt-0.5 ${meta?.color || 'text-gray-400'}`}>{meta?.label}</p>
        {progress !== null && (
          <div className="mt-2">
            <div className="w-full bg-gray-700 rounded-full h-1">
              <div
                className="bg-indigo-500 h-1 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">{progress}%</p>
          </div>
        )}
      </div>
    </Link>
  )
}
