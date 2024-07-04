import { defineStore } from 'pinia'
import { server } from '/src/boot/axios'

const token = localStorage.getItem('token')
const headers = {
  Authorization: `Bearer ${token}`
}

export const useNotaStore = defineStore('nota', {
  state: () => ({
    id: null,
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
      return await server.get('api/nota', { headers })
    },

    async chart() {
      return await server.get('api/nota/chart', { headers })
    },

    async pie() {
      return await server.get('api/nota/pie', { headers })
    },

    async show(no_nota) {
      return await server.get(`api/nota/${no_nota}`, { headers })
    },

    async createSatuan(form) {
      return await server.post('api/nota/satuan', form, { headers })
    },

    async createSatuanBarang(form) {
      return await server.post('api/nota/satuan/barang', form, { headers })
    },

    async createKiloan(form) {
      return await server.post('api/nota/kiloan', form, { headers })
    },

    async edit(form) {
      return await server.put(`api/nota/${form.id}`, form, { headers })
    },

    async delete(id) {
      return await server.delete(`api/nota/${id}`, { headers })
    }
  },
  persist: true
})
