import { defineStore } from 'pinia'
import { server } from '/src/boot/axios'

const token = localStorage.getItem('token')
const headers = {
  Authorization: `Bearer ${token}`
}

export const usePelangganStore = defineStore('pelanggan', {
  state: () => ({
    id: null,
    name: null,
    email: null,
    password: null,
    passwordConfirmation: null,
    role: null,
    jenis_kelamin: null,
    alamat: null
  }),
  getters: {},
  actions: {
    async all() {
      return await server.get('api/pelanggan', { headers })
    },

    async show(id) {
      return await server.get(`api/pelanggan/${id}`, { headers })
    },

    async create(form) {
      return await server.post('api/pelanggan', form, { headers })
    },

    async edit(form) {
      return await server.put(`api/pelanggan/${form.id}`, form, { headers })
    },

    async delete(id) {
      return await server.delete(`api/pelanggan/${id}`, { headers })
    }
  },
  persist: true
})
