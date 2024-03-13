<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
    <div class="container-fluid">
      <img class="navbar-brand p-3" src="src/assets/logo.png" style="width: 80px" />
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse ms-5" id="navbarSupportedContent">
        <ul class="navbar-nav fs-3 me-auto mb-2 mb-lg-0">
          <li class="nav-item mx-2 text-bold">
            <a class="nav-link" aria-current="page" href="#">Home</a>
          </li>
          <li class="nav-item mx-2 text-bold">
            <a class="nav-link" aria-current="page" href="#">About</a>
          </li>
          <li class="nav-item mx-2 text-bold">
            <a class="nav-link" aria-current="page" href="#">Services</a>
          </li>
          <li class="nav-item mx-2 text-bold">
            <a class="nav-link" aria-current="page" href="#">Testimoni</a>
          </li>
        </ul>
        <div v-if="token">
          <a class="btn btn-lg mx-1 fs-2 btn-danger text-light" href="/dashboard/home">Dashboard</a>
          <a class="btn mx-1 fs-4 btn-transparent text-light" @click="logout">Logout</a>
        </div>
        <div v-else>
          <form class="d-flex">
            <a class="btn mx-1 fs-4 btn-transparent text-light" href="/auth/login">Login</a>
            <a class="btn mx-1 fs-4 btn-danger text-light" href="/auth/register">Register</a>
          </form>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from 'src/stores/auth-store'

const $q = useQuasar()
const router = useRouter()
const authStore = useAuthStore()
const token = localStorage.getItem('token')

// Logout
const logout = async () => {
  try {
    await authStore.logout()

    $q.notify({
      message: 'Logout Berhasil',
      icon: 'check',
      color: 'positive'
    })
    router.push({ name: 'login' })
    window.location.reload()
  } catch (error) {
    console.error('Error submitting form:', error)
    $q.notify({
      message: error.response.data.message || 'Logout Gagal',
      icon: 'warning',
      color: 'negative'
    })
  }
}
</script>
