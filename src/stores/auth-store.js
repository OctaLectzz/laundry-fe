import { defineStore } from 'pinia'
import { server } from 'src/boot/axios'

const token = localStorage.getItem('token')
const headers = {
  Authorization: `Bearer ${token}`
}

export const useAuthStore = defineStore('auth', {
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
      return await server.get('api/auth', { headers })
    },

    async show(id) {
      return await server.get(`api/auth/${id}`, { headers })
    },

    async create(form) {
      return await server.post('api/auth', form, { headers })
    },

    async edit(form) {
      return await server.put(`api/auth/${form.id}`, form, { headers })
    },

    async delete(id) {
      return await server.delete(`api/auth/${id}`, { headers })
    }
  },
  persist: true
})
