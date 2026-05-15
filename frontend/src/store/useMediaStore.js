import { create } from 'zustand'
import api from '../api/axios'

const useMediaStore = create((set, get) => ({
  entries: [],
  stats: null,
  loading: false,

  fetchEntries: async (filters = {}) => {
    set({ loading: true })
    const params = new URLSearchParams(filters).toString()
    const { data } = await api.get(`/media?${params}`)
    set({ entries: data, loading: false })
  },

  fetchStats: async () => {
    const { data } = await api.get('/media/stats')
    set({ stats: data })
  },

  addEntry: async (entryData) => {
    const { data } = await api.post('/media', entryData)
    set({ entries: [data, ...get().entries] })
    return data
  },

  updateEntry: async (id, entryData) => {
    const { data } = await api.put(`/media/${id}`, entryData)
    set({
      entries: get().entries.map((e) => (e._id === id ? data : e)),
    })
    return data
  },

  deleteEntry: async (id) => {
    await api.delete(`/media/${id}`)
    set({ entries: get().entries.filter((e) => e._id !== id) })
  },

  searchExternal: async (category, query) => {
    const { data } = await api.get(`/search/${category}?q=${encodeURIComponent(query)}`)
    return data
  },
}))

export default useMediaStore
