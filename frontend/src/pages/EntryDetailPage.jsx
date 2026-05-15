import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import useMediaStore from '../store/useMediaStore'
import toast from 'react-hot-toast'
import { FiEdit2, FiTrash2, FiArrowLeft, FiHeart } from 'react-icons/fi'
import api from '../api/axios'

const STATUS_LABELS = {
  plan_to: 'Plan to',
  in_progress: 'In Progress',
  completed: 'Completed',
  dropped: 'Dropped',
  on_hold: 'On Hold',
}

export default function EntryDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { updateEntry, deleteEntry } = useMediaStore()
  const [entry, setEntry] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/media/${id}`).then(({ data }) => {
      setEntry(data)
      setLoading(false)
    }).catch(() => {
      toast.error('Entry not found')
      navigate('/library')
    })
  }, [id])

  const handleDelete = async () => {
    if (!window.confirm('Remove this entry?')) return
    try {
      await deleteEntry(id)
      toast.success('Entry removed')
      navigate('/library')
    } catch {
      toast.error('Failed to remove')
    }
  }

  const handleToggleFavorite = async () => {
    const updated = await updateEntry(id, { isFavorite: !entry.isFavorite })
    setEntry(updated)
  }

  const handleProgressUpdate = async (newCurrent) => {
    const updated = await updateEntry(id, {
      progress: { ...entry.progress, current: newCurrent },
    })
    setEntry(updated)
  }

  if (loading) return <div className="text-center py-16 text-gray-500">Loading...</div>
  if (!entry) return null

  const progress =
    entry.progress?.total > 0
      ? Math.round((entry.progress.current / entry.progress.total) * 100)
      : null

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white transition-colors">
          <FiArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-white flex-1 truncate">{entry.title}</h1>
        <button onClick={handleToggleFavorite} className={`transition-colors ${entry.isFavorite ? 'text-red-400' : 'text-gray-500 hover:text-red-400'}`}>
          <FiHeart size={20} fill={entry.isFavorite ? 'currentColor' : 'none'} />
        </button>
        <Link to={`/library/${id}/edit`} className="text-gray-400 hover:text-indigo-400 transition-colors">
          <FiEdit2 size={18} />
        </Link>
        <button onClick={handleDelete} className="text-gray-400 hover:text-red-400 transition-colors">
          <FiTrash2 size={18} />
        </button>
      </div>

      <div className="flex gap-6">
        {entry.coverImage ? (
          <img src={entry.coverImage} alt={entry.title} className="w-40 h-56 object-cover rounded-xl flex-shrink-0" />
        ) : (
          <div className="w-40 h-56 bg-gray-800 rounded-xl flex-shrink-0" />
        )}

        <div className="space-y-3 flex-1">
          <div className="flex flex-wrap gap-2">
            <span className="bg-indigo-600/20 text-indigo-400 text-xs px-3 py-1 rounded-full capitalize">{entry.category}</span>
            <span className="bg-gray-800 text-gray-300 text-xs px-3 py-1 rounded-full">{STATUS_LABELS[entry.status]}</span>
            {entry.isFavorite && (
              <span className="bg-red-500/20 text-red-400 text-xs px-3 py-1 rounded-full">Favorite</span>
            )}
          </div>

          {entry.genres?.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {entry.genres.map((g) => (
                <span key={g} className="bg-gray-800 text-gray-400 text-xs px-2 py-0.5 rounded">{g}</span>
              ))}
            </div>
          )}

          {entry.rating && (
            <p className="text-yellow-400 text-lg">
              {'★'.repeat(Math.round(entry.rating / 2))}
              <span className="text-gray-500 text-sm ml-2">{entry.rating}/10</span>
            </p>
          )}

          {progress !== null && (
            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Progress</span>
                <span>{entry.progress.current} / {entry.progress.total}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-indigo-500 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleProgressUpdate(Math.max(0, entry.progress.current - 1))}
                  className="bg-gray-800 hover:bg-gray-700 text-white text-xs px-3 py-1 rounded-lg transition-colors"
                >
                  -1
                </button>
                <button
                  onClick={() => handleProgressUpdate(Math.min(entry.progress.total, entry.progress.current + 1))}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-3 py-1 rounded-lg transition-colors"
                >
                  +1
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {entry.description && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-gray-400 mb-2">Description</h3>
          <p className="text-gray-300 text-sm leading-relaxed">{entry.description}</p>
        </div>
      )}

      {entry.review && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-gray-400 mb-2">My Review</h3>
          <p className="text-gray-300 text-sm leading-relaxed">{entry.review}</p>
        </div>
      )}

      <p className="text-xs text-gray-600">
        Added {new Date(entry.createdAt).toLocaleDateString()}
        {entry.completedAt && ` · Completed ${new Date(entry.completedAt).toLocaleDateString()}`}
      </p>
    </div>
  )
}
