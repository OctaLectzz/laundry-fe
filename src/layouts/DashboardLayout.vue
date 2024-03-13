<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-white text-black">
      <q-toolbar>
        <q-btn flat dense round @click="toggleLeftDrawer" icon="menu" aria-label="Menu" />
        <q-toolbar-title>Dashboard Admin</q-toolbar-title>
        <q-space />
        <div class="q-gutter-sm row items-center no-wrap">
          <!-- FullScreen -->
          <q-btn round dense flat color="dark" :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'" @click="$q.fullscreen.toggle()" v-if="$q.screen.gt.sm"></q-btn>

          <!-- Profile -->
          <q-btn round flat>
            <q-avatar size="26px">
              <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
            </q-avatar>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above :mini="miniState" @mouseover="miniState = false" @mouseout="miniState = true" :width="250" bordered class="bg-white text-black">
      <div class="text-h5 text-bold q-pa-xl">Laundry</div>
      <q-list>
        <!-- Home -->
        <q-item :to="{ name: 'dashboardhome' }" active-class="q-item-no-link-highlighting menu-active" class="menu-click">
          <q-item-section avatar>
            <q-icon name="dashboard" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Home</q-item-label>
          </q-item-section>
        </q-item>

        <!-- User -->
        <q-item :to="{ name: 'dashboarduser' }" active-class="q-item-no-link-highlighting menu-active" class="menu-click">
          <q-item-section avatar>
            <q-icon name="account_circle" />
          </q-item-section>
          <q-item-section>
            <q-item-label>User</q-item-label>
          </q-item-section>
        </q-item>

        <!-- Karyawan -->
        <q-item :to="{ name: 'dashboardkaryawan' }" active-class="q-item-no-link-highlighting menu-active" class="menu-click">
          <q-item-section avatar>
            <q-icon name="contact_mail" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Karyawan</q-item-label>
          </q-item-section>
        </q-item>

        <!-- Barang Satuan -->
        <q-item :to="{ name: 'dashboardbarang' }" active-class="q-item-no-link-highlighting menu-active" class="menu-click">
          <q-item-section avatar>
            <q-icon name="category" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Barang Satuan</q-item-label>
          </q-item-section>
        </q-item>

        <!-- Paket Kiloan -->
        <q-item :to="{ name: 'dashboardkiloan' }" active-class="q-item-no-link-highlighting menu-active" class="menu-click">
          <q-item-section avatar>
            <q-icon name="inventory_2" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Paket Kiloan</q-item-label>
          </q-item-section>
        </q-item>

        <!-- Jenis Layanan -->
        <q-item :to="{ name: 'dashboardjenislayanan' }" active-class="q-item-no-link-highlighting menu-active" class="menu-click">
          <q-item-section avatar>
            <q-icon name="format_list_bulleted" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Jenis Layanan</q-item-label>
          </q-item-section>
        </q-item>

        <!-- Pelanggan -->
        <!-- <q-item :to="{ name: 'dashboardpelanggan' }" active-class="q-item-no-link-highlighting menu-active" class="menu-click">
          <q-item-section avatar>
            <q-icon name="people" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Pelanggan</q-item-label>
          </q-item-section>
        </q-item> -->

        <!-- Nota -->
        <q-item :to="{ name: 'dashboardnota' }" active-class="q-item-no-link-highlighting menu-active" class="menu-click">
          <q-item-section avatar>
            <q-icon name="text_snippet" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Nota</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>

      <q-separator />

      <!-- Kembali ke Beranda -->
      <q-list class="">
        <q-item to="/" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="reply_all" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Ke Beranda</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container class="bg-grey-2">
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'

const leftDrawerOpen = ref(false)
const miniState = ref(false)
const $q = useQuasar()
const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
  miniState.value = !miniState.value
}
</script>

<style scoped>
.menu-click:hover {
  background-color: #dfe3ff !important;
  border-left: solid 0.313rem #6571ff;
  box-shadow: none;
}
.menu-click {
  border-left: solid 0.313rem transparent;
}
.menu-click:hover .q-item-label {
  color: #000000 !important;
}

.menu-active {
  background-color: #dfe3ff !important;
  border-left: solid 0.313rem #6571ff;
  box-shadow: none;
}
</style>
