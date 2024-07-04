<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="text-dark q-py-sm" :class="$q.dark.isActive ? 'bg-dark text-white' : ''" style="background-color: #ececf1" elevated>
      <q-toolbar>
        <q-btn @click="toggleDrawer" icon="menu" aria-label="Menu" flat dense round />

        <q-toolbar-title>Dashboard</q-toolbar-title>

        <q-space />

        <div class="q-gutter-sm row items-center no-wrap">
          <!-- Switch Mode -->
          <q-btn color="primary" :icon="$q.dark.isActive ? 'brightness_7' : 'brightness_4'" class="q-mx-sm" @click="toggleSwitchMode" flat round dense />

          <!-- Refresh -->
          <q-btn color="primary" icon="refresh" class="q-mx-sm" @click="$router.go()" round dense flat />

          <!-- FullScreen -->
          <q-btn v-if="$q.screen.gt.sm" color="primary" :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'" class="q-mx-sm" @click="$q.fullscreen.toggle()" round dense flat />

          <!-- Profile Menu -->
          <q-btn-dropdown v-if="loading" color="primary" class="q-mx-sm" rounded dense flat push no-caps>
            <template v-slot:label>
              <q-skeleton type="QAvatar" size="30px" />
            </template>
          </q-btn-dropdown>
          <q-btn-dropdown v-else color="primary" class="q-mx-sm" rounded dense flat push no-caps>
            <template v-slot:label>
              <q-avatar size="30px">
                <img src="/img/avatar-admin.jpg" />
              </q-avatar>
            </template>
            <div>
              <q-list class="nav-profile">
                <q-item @click="navigateTo('home')" class="q-pr-lg" clickable v-close-popup dense>
                  <q-item-section>
                    <div class="q-py-sm">
                      <q-icon name="home" size="18px" class="q-mx-xs" />
                      Beranda
                    </div>
                  </q-item-section>
                </q-item>

                <q-item @click="navigateTo('home.profile')" class="q-pr-lg" clickable v-close-popup dense>
                  <q-item-section>
                    <div class="q-py-sm">
                      <q-icon name="lock" size="18px" class="q-mx-xs" />
                      Lockscreen
                    </div>
                  </q-item-section>
                </q-item>

                <q-separator />

                <q-item @click="logout" class="q-pr-lg" clickable v-close-popup dense>
                  <q-item-section>
                    <div class="text-red">
                      <q-icon name="power_settings_new" size="15px" class="q-pb-xs q-mx-xs" />
                      Logout
                    </div>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </q-btn-dropdown>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" :mini="miniState" :width="250" class="text-white q-pb-xl" :class="$q.dark.isActive ? 'bg-grey-10' : 'bg-dark'" bordered show-if-above>
      <q-list>
        <!-- Brand -->
        <q-item class="row justify-center q-py-lg">
          <q-item-section avatar>
            <div v-if="!miniState" class="text-h4 text-center text-bold">LAUNDRY</div>
          </q-item-section>
        </q-item>

        <q-separator dark />

        <!-- MAIN -->
        <q-separator />
        <div class="menu-text-header q-mx-md q-mb-sm q-mt-md" style="font-size: 11px"><span v-if="!miniState">MAIN</span></div>

        <!-- Home -->
        <q-item :to="{ name: 'dashboardhome' }" active-class="q-item-no-link-highlighting menu-active" class="menu-click menu-text q-py-md">
          <q-item-section avatar>
            <q-icon name="dashboard" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Home</q-item-label>
          </q-item-section>
        </q-item>

        <!-- User -->
        <q-item v-if="role == 'Admin'" :to="{ name: 'dashboarduser' }" active-class="q-item-no-link-highlighting menu-active" class="menu-click menu-text q-py-md">
          <q-item-section avatar>
            <q-icon name="account_circle" />
          </q-item-section>
          <q-item-section>
            <q-item-label>User</q-item-label>
          </q-item-section>
        </q-item>

        <!-- Karyawan -->
        <q-item v-if="role == 'Admin'" :to="{ name: 'dashboardkaryawan' }" active-class="q-item-no-link-highlighting menu-active" class="menu-click menu-text q-py-md">
          <q-item-section avatar>
            <q-icon name="contact_mail" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Karyawan</q-item-label>
          </q-item-section>
        </q-item>

        <!-- MANAGEMENT -->
        <q-separator />
        <div class="menu-text-header q-mx-md q-mb-sm q-mt-md" style="font-size: 11px"><span v-if="!miniState">MANAGEMENT</span></div>

        <!-- Barang Satuan -->
        <q-item :to="{ name: 'dashboardbarang' }" active-class="q-item-no-link-highlighting menu-active" class="menu-click menu-text q-py-md">
          <q-item-section avatar>
            <q-icon name="category" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Barang Satuan</q-item-label>
          </q-item-section>
        </q-item>

        <!-- Paket Kiloan -->
        <q-item :to="{ name: 'dashboardkiloan' }" active-class="q-item-no-link-highlighting menu-active" class="menu-click menu-text q-py-md">
          <q-item-section avatar>
            <q-icon name="inventory_2" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Paket Kiloan</q-item-label>
          </q-item-section>
        </q-item>

        <!-- Jenis Layanan -->
        <q-item :to="{ name: 'dashboardjenislayanan' }" active-class="q-item-no-link-highlighting menu-active" class="menu-click menu-text q-py-md">
          <q-item-section avatar>
            <q-icon name="format_list_bulleted" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Jenis Layanan</q-item-label>
          </q-item-section>
        </q-item>

        <!-- PEMBAYARAN -->
        <q-separator />
        <div class="menu-text-header q-mx-md q-mb-sm q-mt-md" style="font-size: 11px"><span v-if="!miniState">PEMBAYARAN</span></div>

        <!-- Nota -->
        <q-item :to="{ name: 'dashboardnota' }" active-class="q-item-no-link-highlighting menu-active" class="menu-click menu-text q-py-md">
          <q-item-section avatar>
            <q-icon name="text_snippet" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Nota</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container :class="$q.dark.isActive ? 'bg-grey-10' : 'bg-grey-3'">
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from '/src/stores/auth-store'

const $q = useQuasar()
const router = useRouter()
const authStore = useAuthStore()
const role = localStorage.getItem('role')

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

// Sidebar
const leftDrawerOpen = ref(false)
const miniState = ref(false)
const desktop = ref(false)
const detectDesktop = () => {
  desktop.value = window.innerWidth > 1023
}
const toggleDrawer = () => {
  if (desktop.value) {
    miniState.value = !miniState.value
  } else {
    leftDrawerOpen.value = !leftDrawerOpen.value
  }
}
onMounted(() => {
  detectDesktop()
  window.addEventListener('resize', detectDesktop)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', detectDesktop)
})

// Switch Mode
const darkmode = localStorage.getItem('darkmode') || 'false'
const isDarkMode = ref(JSON.parse(darkmode))
$q.dark.set(isDarkMode.value)
const toggleSwitchMode = () => {
  const newMode = !isDarkMode.value
  $q.dark.set(newMode)

  isDarkMode.value = newMode
  localStorage.setItem('darkmode', newMode)
}

// Navigate
const navigateTo = (name, params) => {
  router.push({ name: name, params: params })
}

// Logout
const logout = async () => {
  $q.dialog({
    title: 'Keluar',
    message: 'Apakah anda yakin?',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await useAuthStore().logout()

      $q.notify({
        message: 'Logout Berhasil',
        icon: 'check',
        color: 'positive'
      })
    } catch (error) {
      console.error('Error submitting form:', error)
      $q.notify({
        message: error.response.data.message || 'Logout Gagal',
        icon: 'warning',
        color: 'negative'
      })
    }
  })
}
</script>

<style scoped>
.menu-click:hover {
  background: linear-gradient(to left, var(--q-secondary), rgba(255, 255, 255, 0));
  border-right: solid 0.313rem var(--q-primary);
  box-shadow: none;
  filter: brightness(80%);
}
.menu-active {
  background: linear-gradient(to left, var(--q-secondary), rgba(255, 255, 255, 0));
  border-right: solid 0.313rem var(--q-primary);
  box-shadow: none;
  filter: brightness(110%);
}
.menu-text {
  color: #98c9de;
  font-size: 13px;
}
.menu-text-header {
  color: #57b5de;
  font-size: 13px;
}
</style>
