import { defineStore } from 'pinia'
import { server } from 'src/boot/axios'

const token = localStorage.getItem('token')
const headers = {
  Authorization: `Bearer ${token}`
}

export const useJenisLayananStore = defineStore('jenislayanan', {
  state: () => ({
    id: null,
    jenis_cuci: null,
    waktu: null,
    harga: null
  }),
  getters: {},
  actions: {
    async all() {
      return await server.get('api/jenislayanan', { headers })
    },

    async show(id) {
      return await server.get(`api/jenislayanan/${id}`, { headers })
    },

    async create(form) {
      return await server.post('api/jenislayanan', form, { headers })
    },

    async edit(form) {
      return await server.put(`api/jenislayanan/${form.id}`, form, { headers })
    },

    async delete(id) {
      return await server.delete(`api/jenislayanan/${id}`, { headers })
    }
  },
  persist: true
})
