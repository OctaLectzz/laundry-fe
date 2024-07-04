import { defineStore } from 'pinia'
import { server } from '/src/boot/axios'

const token = localStorage.getItem('token')
const headers = {
  Authorization: `Bearer ${token}`
}

export const useKiloanStore = defineStore('kiloan', {
  state: () => ({
    id: null,
    paket: null,
    harga: null,
    description: null
  }),
  getters: {},
  actions: {
    async all() {
      return await server.get('api/kiloan', { headers })
    },

    async show(id) {
      return await server.get(`api/kiloan/${id}`, { headers })
    },

    async create(form) {
      return await server.post('api/kiloan', form, { headers })
    },

    async edit(form) {
      return await server.put(`api/kiloan/${form.id}`, form, { headers })
    },

    async delete(id) {
      return await server.delete(`api/kiloan/${id}`, { headers })
    }
  },
  persist: true
})
