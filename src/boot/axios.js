import { boot } from 'quasar/wrappers'
import axios from 'axios'

const url = 'http://localhost:8000'
const server = axios.create({ baseURL: url })

axios.defaults.withCredentials = true
axios.interceptors.request.use(async function (config) {
  if (!config.url.includes('/sanctum/csrf-cookie')) {
    await server.get('/sanctum/csrf-cookie')
  }
  return config
})

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios

  app.config.globalProperties.$server = server
})

export { axios, server, url }
