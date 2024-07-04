import { defineStore } from 'pinia'
import { server } from '/src/boot/axios'

const token = localStorage.getItem('token')
const headers = {
  Authorization: `Bearer ${token}`
}

export const useBarangStore = defineStore('barang', {
  state: () => ({
    id: null,
    name: null,
    harga: null
  }),
  getters: {},
  actions: {
    async all() {
      return await server.get('api/barang', { headers })
    },

    async show(id) {
      return await server.get(`api/barang/${id}`, { headers })
    },

    async create(form) {
      return await server.post('api/barang', form, { headers })
    },

    async edit(form) {
      return await server.put(`api/barang/${form.id}`, form, { headers })
    },

    async delete(id) {
      return await server.delete(`api/barang/${id}`, { headers })
    }
  },
  persist: true
})
