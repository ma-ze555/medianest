import { useState } from 'react'
import useAuthStore from '../store/useAuthStore'
import toast from 'react-hot-toast'
import { FiUser } from 'react-icons/fi'

export default function ProfilePage() {
  const { user, updateProfile } = useAuthStore()
  const [form, setForm] = useState({
    username: user?.username || '',
    bio: user?.bio || '',
    avatar: user?.avatar || '',
    password: '',
  })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        username: form.username,
        bio: form.bio,
        avatar: form.avatar,
      }
      if (form.password) payload.password = form.password
      await updateProfile(payload)
      toast.success('Profile updated!')
    } catch {
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-white">Profile</h1>

      <div className="flex items-center gap-4">
        {user?.avatar ? (
          <img src={user.avatar} alt="avatar" className="w-20 h-20 rounded-full object-cover border-2 border-indigo-500" />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center border-2 border-gray-700">
            <FiUser size={32} className="text-gray-500" />
          </div>
        )}
        <div>
          <p className="text-white font-semibold text-lg">{user?.username}</p>
          <p className="text-gray-400 text-sm">{user?.email}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-semibold text-white">Edit Profile</h2>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Username</label>
          <input
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Avatar URL</label>
          <input
            value={form.avatar}
            onChange={(e) => setForm({ ...form, avatar: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500"
            placeholder="https://..."
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Bio</label>
          <textarea
            rows={3}
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 resize-none"
            placeholder="Tell something about yourself..."
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">New Password</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500"
            placeholder="Leave blank to keep current"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition-colors"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}
