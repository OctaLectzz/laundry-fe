import { defineStore } from 'pinia'
import { server } from '/src/boot/axios'

const token = localStorage.getItem('token')
const headers = {
  Authorization: `Bearer ${token}`
}

export const useUserStore = defineStore('user', {
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
      return await server.get('api/user', { headers })
    },

    async show(id) {
      return await server.get(`api/user/${id}`, { headers })
    },

    async create(form) {
      return await server.post('api/user', form, { headers })
    },

    async edit(form) {
      return await server.put(`api/user/${form.id}`, form, { headers })
    },

    async delete(id) {
      return await server.delete(`api/user/${id}`, { headers })
    }
  },
  persist: true
})
