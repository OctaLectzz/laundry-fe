import { defineStore } from 'pinia'
import { server } from '../boot/axios'

const token = localStorage.getItem('token')
const role = localStorage.getItem('role')
const headers = {
  Authorization: `Bearer ${token}`
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    id: null,
    name: null,
    email: null,
    password: null,
    role: null
  }),

  getters: {},

  actions: {
    async profile() {
      try {
        return await server.get('api/auth/profile', { headers })
      } catch (error) {
        if (error) throw error
      }
    },

    async register(name, email, password, repassword) {
      try {
        return await server.post('api/auth/register', {
          name,
          email,
          password,
          repassword
        })
      } catch (error) {
        if (error) throw error
      }
    },

    async login(email, password) {
      try {
        return await server.post('api/auth/login', { email, password })
      } catch (error) {
        if (error) throw error
      }
    },

    async logout() {
      try {
        await server.get('api/auth/logout', { headers })

        localStorage.removeItem('token')
        localStorage.removeItem('role')
      } catch (error) {
        if (error) throw error
      }
    }
  }
})
