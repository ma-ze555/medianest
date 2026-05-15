import { create } from 'zustand'
import api from '../api/axios'

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('medianest_user') || 'null'),

  login: async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    localStorage.setItem('medianest_user', JSON.stringify(data))
    set({ user: data })
  },

  register: async (username, email, password) => {
    const { data } = await api.post('/auth/register', { username, email, password })
    localStorage.setItem('medianest_user', JSON.stringify(data))
    set({ user: data })
  },

  logout: () => {
    localStorage.removeItem('medianest_user')
    set({ user: null })
  },

  updateProfile: async (profileData) => {
    const { data } = await api.put('/auth/profile', profileData)
    localStorage.setItem('medianest_user', JSON.stringify(data))
    set({ user: data })
  },
}))

export default useAuthStore
