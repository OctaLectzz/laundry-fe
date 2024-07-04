import { defineStore } from 'pinia'
import { server } from '/src/boot/axios'

const token = localStorage.getItem('token')
const headers = {
  Authorization: `Bearer ${token}`
}

export const useKaryawanStore = defineStore('karyawan', {
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
      return await server.get('api/karyawan', { headers })
    },

    async show(id) {
      return await server.get(`api/karyawan/${id}`, { headers })
    },

    async create(form) {
      return await server.post('api/karyawan', form, { headers })
    },

    async edit(form) {
      return await server.put(`api/karyawan/${form.id}`, form, { headers })
    },

    async delete(id) {
      return await server.delete(`api/karyawan/${id}`, { headers })
    }
  },
  persist: true
})
