<template>
  <div>
    <q-form @submit="editUser">
      <q-card style="min-width: 400px">
        <q-card-section class="row items-center q-py-sm">
          <div class="text-h6">Edit User</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-separator />

        <q-card-section class="scroll">
          <div class="row justify-center">
            <!-- Name -->
            <div class="col-5 q-mr-md">
              <div class="text-bold" style="margin-bottom: -10px">Name :</div>
              <q-input v-model="data.name" label="Name" class="q-my-sm" dense outlined required :rules="nameRules" autofocus />
            </div>

            <!-- Email -->
            <div class="col-5 q-ml-md">
              <div class="text-bold" style="margin-bottom: -10px">Email :</div>
              <q-input v-model="data.email" label="Email" class="q-my-sm" dense outlined required :rules="emailRules" />
            </div>
          </div>

          <div class="row justify-center">
            <!-- Alamat -->
            <div class="col-5 q-mr-md">
              <div class="text-bold" style="margin-bottom: -10px">Alamat :</div>
              <q-input v-model="data.alamat" type="textarea" label="Alamat" class="q-my-sm" dense outlined />
            </div>

            <div class="col-5 q-ml-md">
              <!-- Jenis Kelamin -->
              <div class="text-bold" style="margin-bottom: 10px">Jenis Kelamin :</div>
              <div class="q-gutter-sm">
                <q-radio dense v-model="data.jenis_kelamin" val="Laki-Laki" label="Laki-Laki" />
                <q-radio dense v-model="data.jenis_kelamin" val="Perempuan" label="Perempuan" />
              </div>
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Batal" color="dark" v-close-popup />
          <q-btn type="submit" label="Simpan" color="dark" :disable="disabledButton"></q-btn>
        </q-card-actions>
      </q-card>
    </q-form>
  </div>
</template>

<script setup>
import { ref, defineEmits, computed, defineProps } from 'vue'
import { useQuasar } from 'quasar'
import { useUserStore } from 'src/stores/user-store.js'

const $q = useQuasar()
const emits = defineEmits(['edited'])
const { user } = defineProps(['user'])
const userStore = useUserStore()
const data = ref({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  jenis_kelamin: user.jenis_kelamin,
  alamat: user.alamat
})

// Validate
const nameRules = [(v) => !!v || 'Nama harus diisi', (v) => (v && v.length <= 255) || 'Nama tidak boleh lebih dari 255 karakter']
const emailRules = [(v) => !!v || 'Email harus diisi', (v) => /.+@.+\..+/.test(v) || 'Format email tidak valid']
const roleRules = [(v) => !!v || 'Role harus diisi']

// Disabled Button
const loading = ref(false)
const disabledButton = computed(() => {
  return loading.value || !data.value.name || !data.value.email || !data.value.role || !data.value.jenis_kelamin
})

// Edit Data
const editUser = async () => {
  loading.value = true

  try {
    await userStore.edit(data.value)
    $q.notify({
      message: 'Berhasil Mengedit User',
      icon: 'check',
      color: 'positive'
    })
    emits('edited')
  } catch (error) {
    console.error('Error submitting form:', error)
    $q.notify({
      message: error.response.data.message || 'Gagal Mengedit User',
      icon: 'warning',
      color: 'negative'
    })
  }

  loading.value = false
}
</script>
