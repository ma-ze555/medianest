import { useEffect } from 'react'
import useMediaStore from '../store/useMediaStore'
import { FiTv, FiFilm, FiMusic, FiBook, FiAward, FiHeart } from 'react-icons/fi'

const CATEGORY_META = {
  anime: { label: 'Anime', icon: FiTv, color: 'text-pink-400', bar: 'bg-pink-400' },
  movie: { label: 'Movies', icon: FiFilm, color: 'text-blue-400', bar: 'bg-blue-400' },
  series: { label: 'Series', icon: FiTv, color: 'text-purple-400', bar: 'bg-purple-400' },
  music: { label: 'Music', icon: FiMusic, color: 'text-green-400', bar: 'bg-green-400' },
  novel: { label: 'Novels', icon: FiBook, color: 'text-yellow-400', bar: 'bg-yellow-400' },
}

const STATUS_LABELS = {
  plan_to: 'Plan to',
  in_progress: 'In Progress',
  completed: 'Completed',
  dropped: 'Dropped',
  on_hold: 'On Hold',
}

export default function StatsPage() {
  const { stats, fetchStats } = useMediaStore()

  useEffect(() => {
    fetchStats()
  }, [])

  if (!stats) return <div className="text-center py-16 text-gray-500">Loading stats...</div>

  // Build a map: category -> { status -> count }
  const breakdown = {}
  stats.stats.forEach(({ _id, count }) => {
    if (!breakdown[_id.category]) breakdown[_id.category] = {}
    breakdown[_id.category][_id.status] = count
  })

  // Total per category
  const totals = {}
  Object.entries(breakdown).forEach(([cat, statuses]) => {
    totals[cat] = Object.values(statuses).reduce((a, b) => a + b, 0)
  })
  const grandTotal = Object.values(totals).reduce((a, b) => a + b, 0)

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white">Your Stats</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <FiAward className="text-indigo-400 mb-2" size={24} />
          <p className="text-3xl font-bold text-white">{stats.totalCompleted}</p>
          <p className="text-gray-400 text-sm">Total Completed</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <FiHeart className="text-red-400 mb-2" size={24} />
          <p className="text-3xl font-bold text-white">{stats.favorites}</p>
          <p className="text-gray-400 text-sm">Favorites</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <FiTv className="text-gray-400 mb-2" size={24} />
          <p className="text-3xl font-bold text-white">{grandTotal}</p>
          <p className="text-gray-400 text-sm">Total Entries</p>
        </div>
      </div>

      {/* Per category breakdown */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">By Category</h2>
        {Object.entries(CATEGORY_META).map(([key, meta]) => {
          const Icon = meta.icon
          const catData = breakdown[key] || {}
          const total = totals[key] || 0
          const completed = catData.completed || 0
          const pct = total > 0 ? Math.round((completed / total) * 100) : 0

          return (
            <div key={key} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Icon className={meta.color} size={18} />
                  <span className="text-white font-medium">{meta.label}</span>
                </div>
                <span className="text-gray-400 text-sm">{total} total</span>
              </div>

              {/* Status breakdown */}
              <div className="flex flex-wrap gap-3 mb-3">
                {Object.entries(STATUS_LABELS).map(([s, label]) => (
                  catData[s] ? (
                    <span key={s} className="text-xs text-gray-400">
                      {label}: <span className="text-white font-medium">{catData[s]}</span>
                    </span>
                  ) : null
                ))}
              </div>

              {/* Completion bar */}
              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Completion rate</span>
                  <span>{pct}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className={`${meta.bar} h-2 rounded-full transition-all`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
