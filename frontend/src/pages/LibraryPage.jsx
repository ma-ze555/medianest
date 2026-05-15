import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import useMediaStore from '../store/useMediaStore'
import { FiPlus, FiSearch, FiTv, FiFilm, FiMusic, FiBook, FiTrash2, FiEdit2 } from 'react-icons/fi'
import toast from 'react-hot-toast'

const CATEGORIES = ['all', 'anime', 'movie', 'series', 'music', 'novel']
const STATUSES = ['all', 'plan_to', 'in_progress', 'completed', 'dropped', 'on_hold']

const STATUS_LABELS = {
  plan_to: 'Plan to',
  in_progress: 'In Progress',
  completed: 'Completed',
  dropped: 'Dropped',
  on_hold: 'On Hold',
}

const CATEGORY_ICONS = {
  anime: FiTv,
  movie: FiFilm,
  series: FiTv,
  music: FiMusic,
  novel: FiBook,
}

const CATEGORY_COLORS = {
  anime: 'text-pink-400',
  movie: 'text-blue-400',
  series: 'text-purple-400',
  music: 'text-green-400',
  novel: 'text-yellow-400',
}

export default function LibraryPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const { entries, fetchEntries, deleteEntry, loading } = useMediaStore()

  const category = searchParams.get('category') || 'all'
  const status = searchParams.get('status') || 'all'

  useEffect(() => {
    const filters = {}
    if (category !== 'all') filters.category = category
    if (status !== 'all') filters.status = status
    if (search) filters.search = search
    fetchEntries(filters)
  }, [category, status, search])

  const handleDelete = async (id, e) => {
    e.preventDefault()
    if (!window.confirm('Remove this entry?')) return
    try {
      await deleteEntry(id)
      toast.success('Entry removed')
    } catch {
      toast.error('Failed to remove entry')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Library</h1>
        <Link
          to="/library/add"
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded-lg transition-colors"
        >
          <FiPlus size={16} /> Add New
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search your library..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-9 pr-4 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Category filter */}
        <select
          value={category}
          onChange={(e) => setSearchParams({ category: e.target.value, status })}
          className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c === 'all' ? 'All Categories' : c.charAt(0).toUpperCase() + c.slice(1)}</option>
          ))}
        </select>

        {/* Status filter */}
        <select
          value={status}
          onChange={(e) => setSearchParams({ category, status: e.target.value })}
          className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s === 'all' ? 'All Statuses' : STATUS_LABELS[s]}</option>
          ))}
        </select>
      </div>

      {/* Entries grid */}
      {loading ? (
        <div className="text-center py-16 text-gray-500">Loading...</div>
      ) : entries.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p>No entries found.</p>
          <Link to="/library/add" className="text-indigo-400 hover:underline text-sm mt-2 inline-block">Add something</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {entries.map((entry) => {
            const Icon = CATEGORY_ICONS[entry.category] || FiTv
            const color = CATEGORY_COLORS[entry.category] || 'text-gray-400'
            return (
              <div key={entry._id} className="relative group">
                <Link
                  to={`/library/${entry._id}`}
                  className="block bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-600 transition-colors"
                >
                  {entry.coverImage ? (
                    <img src={entry.coverImage} alt={entry.title} className="w-full h-44 object-cover" />
                  ) : (
                    <div className="w-full h-44 bg-gray-800 flex items-center justify-center">
                      <Icon size={32} className={color} />
                    </div>
                  )}
                  <div className="p-3">
                    <p className="text-white text-sm font-medium truncate">{entry.title}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className={`text-xs ${color}`}>{entry.category}</span>
                      <span className="text-xs text-gray-500">{STATUS_LABELS[entry.status]}</span>
                    </div>
                    {entry.rating && (
                      <p className="text-yellow-400 text-xs mt-1">{'★'.repeat(Math.round(entry.rating / 2))}</p>
                    )}
                  </div>
                </Link>

                {/* Action buttons on hover */}
                <div className="absolute top-2 right-2 hidden group-hover:flex gap-1">
                  <Link
                    to={`/library/${entry._id}/edit`}
                    className="bg-gray-800 hover:bg-indigo-600 text-white p-1.5 rounded-lg transition-colors"
                  >
                    <FiEdit2 size={13} />
                  </Link>
                  <button
                    onClick={(e) => handleDelete(entry._id, e)}
                    className="bg-gray-800 hover:bg-red-600 text-white p-1.5 rounded-lg transition-colors"
                  >
                    <FiTrash2 size={13} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
