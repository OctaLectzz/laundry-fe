import { defineStore } from 'pinia'
import { server } from 'src/boot/axios'

const token = localStorage.getItem('token')
const headers = {
  Authorization: `Bearer ${token}`
}

export const useNotabarangStore = defineStore('notabarang', {
  state: () => ({
    id: null,
    jenis: null,
    nama_pelanggan: null,
    barangs: null,
    jenis_layanan: null,
    kiloan_id: null,
    waktu: null,
    tanggal: null,
    total_harga: null
  }),
  getters: {},
  actions: {
    async all() {
      return await server.get('api/notabarang', { headers })
    },

    async show(id) {
      return await server.get(`api/notabarang/${id}`, { headers })
    },

    async create(form) {
      return await server.post('api/notabarang', form, { headers })
    },

    async edit(form) {
      return await server.put(`api/notabarang/${form.id}`, form, { headers })
    },

    async delete(id) {
      return await server.delete(`api/notabarang/${id}`, { headers })
    }
  },
  persist: true
})
