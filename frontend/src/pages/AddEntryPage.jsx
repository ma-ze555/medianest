import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import useMediaStore from '../store/useMediaStore'
import { FiSearch } from 'react-icons/fi'

const CATEGORIES = ['anime', 'movie', 'series', 'music', 'novel']
const STATUSES = ['plan_to', 'in_progress', 'completed', 'dropped', 'on_hold']
const STATUS_LABELS = {
  plan_to: 'Plan to',
  in_progress: 'In Progress',
  completed: 'Completed',
  dropped: 'Dropped',
  on_hold: 'On Hold',
}

export default function AddEntryPage() {
  const navigate = useNavigate()
  const { addEntry, searchExternal } = useMediaStore()

  const [category, setCategory] = useState('anime')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState({
    title: '',
    coverImage: '',
    description: '',
    genres: '',
    status: 'plan_to',
    rating: '',
    review: '',
    progress: { current: 0, total: 0 },
  })
  const [saving, setSaving] = useState(false)

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    setSearching(true)
    setSearchResults([])
    try {
      // Add small delay to respect Jikan rate limits
      await new Promise(resolve => setTimeout(resolve, 500))
      const results = await searchExternal(category, searchQuery)
      setSearchResults(results)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Search failed. Try again in a moment.')
    } finally {
      setSearching(false)
    }
  }

  const handleSelect = (item) => {
    setSelected(item)
    setForm({
      ...form,
      title: item.title,
      coverImage: item.coverImage || '',
      description: item.description || '',
      genres: (item.genres || []).join(', '),
      progress: { current: 0, total: item.totalEpisodes || item.totalPages || 0 },
    })
    setSearchResults([])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await addEntry({
        category,
        title: form.title,
        coverImage: form.coverImage,
        description: form.description,
        genres: form.genres.split(',').map((g) => g.trim()).filter(Boolean),
        status: form.status,
        rating: form.rating ? Number(form.rating) : null,
        review: form.review,
        progress: form.progress,
        externalId: selected?.externalId || '',
      })
      toast.success('Added to your library!')
      navigate('/library')
    } catch {
      toast.error('Failed to add entry')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-white">Add to Library</h1>

      {/* Category selector */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => { setCategory(c); setSearchResults([]); setSelected(null) }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              category === c
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {c.charAt(0).toUpperCase() + c.slice(1)}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder={`Search for a ${category}...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500"
        />
        <button
          onClick={handleSearch}
          disabled={searching}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2 text-sm"
        >
          <FiSearch size={16} />
          {searching ? 'Searching...' : 'Search'}
        </button>
      </div>

      {/* Search results */}
      {searchResults.length > 0 && (
        <div className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden">
          {searchResults.map((item) => (
            <button
              key={item.externalId}
              onClick={() => handleSelect(item)}
              className="w-full flex items-center gap-3 p-3 hover:bg-gray-800 transition-colors text-left border-b border-gray-800 last:border-0"
            >
              {item.coverImage && (
                <img src={item.coverImage} alt={item.title} className="w-10 h-14 object-cover rounded" />
              )}
              <div>
                <p className="text-white text-sm font-medium">{item.title}</p>
                <p className="text-gray-400 text-xs line-clamp-1">{item.description}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-semibold text-white">Entry Details</h2>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Title *</label>
          <input
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Cover Image URL</label>
          <input
            value={form.coverImage}
            onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500"
            placeholder="https://..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{STATUS_LABELS[s]}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Rating (1–10)</label>
            <input
              type="number"
              min="1"
              max="10"
              value={form.rating}
              onChange={(e) => setForm({ ...form, rating: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500"
              placeholder="Optional"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Progress (current)</label>
            <input
              type="number"
              min="0"
              value={form.progress.current}
              onChange={(e) => setForm({ ...form, progress: { ...form.progress, current: Number(e.target.value) } })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Total (episodes/pages)</label>
            <input
              type="number"
              min="0"
              value={form.progress.total}
              onChange={(e) => setForm({ ...form, progress: { ...form.progress, total: Number(e.target.value) } })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Genres (comma separated)</label>
          <input
            value={form.genres}
            onChange={(e) => setForm({ ...form, genres: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500"
            placeholder="Action, Fantasy, Romance"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Review / Notes</label>
          <textarea
            rows={3}
            value={form.review}
            onChange={(e) => setForm({ ...form, review: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 resize-none"
            placeholder="Your thoughts..."
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition-colors"
          >
            {saving ? 'Saving...' : 'Add to Library'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/library')}
            className="px-6 bg-gray-800 hover:bg-gray-700 text-white py-2.5 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
