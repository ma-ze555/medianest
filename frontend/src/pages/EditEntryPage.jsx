import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import useMediaStore from '../store/useMediaStore'
import api from '../api/axios'
import { FiArrowLeft } from 'react-icons/fi'

const STATUSES = ['plan_to', 'in_progress', 'completed', 'dropped', 'on_hold']
const STATUS_LABELS = {
  plan_to: 'Plan to',
  in_progress: 'In Progress',
  completed: 'Completed',
  dropped: 'Dropped',
  on_hold: 'On Hold',
}

export default function EditEntryPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { updateEntry } = useMediaStore()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: '',
    coverImage: '',
    status: 'plan_to',
    rating: '',
    review: '',
    genres: '',
    progress: { current: 0, total: 0 },
    currentSeason: 1,
    isFavorite: false,
  })

  useEffect(() => {
    api.get(`/media/${id}`).then(({ data }) => {
      setForm({
        title: data.title || '',
        coverImage: data.coverImage || '',
        status: data.status || 'plan_to',
        rating: data.rating || '',
        review: data.review || '',
        genres: (data.genres || []).join(', '),
        progress: data.progress || { current: 0, total: 0 },
        currentSeason: data.currentSeason || 1,
        isFavorite: data.isFavorite || false,
      })
      setLoading(false)
    }).catch(() => {
      toast.error('Entry not found')
      navigate('/library')
    })
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await updateEntry(id, {
        title: form.title,
        coverImage: form.coverImage,
        status: form.status,
        rating: form.rating ? Number(form.rating) : null,
        review: form.review,
        genres: form.genres.split(',').map((g) => g.trim()).filter(Boolean),
        progress: form.progress,
        currentSeason: form.currentSeason,
        isFavorite: form.isFavorite,
      })
      toast.success('Entry updated!')
      navigate(`/library/${id}`)
    } catch {
      toast.error('Failed to update entry')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="text-center py-16 text-gray-500">Loading...</div>

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white transition-colors">
          <FiArrowLeft size={20} />
        </button>
        <h1 className="text-3xl font-bold text-white">Edit Entry</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">

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
          {form.coverImage && (
            <img src={form.coverImage} alt="preview" className="mt-2 h-24 rounded-lg object-cover" />
          )}
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

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="favorite"
            checked={form.isFavorite}
            onChange={(e) => setForm({ ...form, isFavorite: e.target.checked })}
            className="w-4 h-4 accent-indigo-500"
          />
          <label htmlFor="favorite" className="text-sm text-gray-400">Mark as Favorite</label>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition-colors"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 bg-gray-800 hover:bg-gray-700 text-white py-2.5 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
