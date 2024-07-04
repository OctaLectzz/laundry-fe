<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useAuthStore } from '/src/stores/auth-store'

const authStore = useAuthStore()

// Profile
const profile = ref({})
const loading = ref(true)
const getProfile = async () => {
  try {
    const res = await authStore.profile()

    profile.value = res.data.data
    loading.value = false
  } catch (error) {
    console.error('Error fetching data:', error)
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    $q.notify({
      message: 'Sesi Habis',
      icon: 'warning',
      color: 'negative'
    })
    window.location.reload()
  }
}
onMounted(() => {
  getProfile()
})
</script>
