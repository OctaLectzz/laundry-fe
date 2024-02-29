<template>
  <div>
    <q-form @submit="editUser">
      <q-card style="min-width: 400px">
        <q-card-section class="row items-center q-py-sm">
          <div class="text-h6">Edit barang</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-separator />

        <q-card-section class="scroll">
          <div class="row justify-center">
            <!-- Name -->
            <div class="col-10">
              <div class="text-bold" style="margin-bottom: -10px">Nama :</div>
              <q-input v-model="data.name" label="Name" class="q-my-sm" dense outlined required :rules="nameRules" autofocus />
            </div>

            <!-- Harga -->
            <div class="col-10">
              <div class="text-bold" style="margin-bottom: -10px">Harga :</div>
              <q-input v-model="data.harga" type="number" label="Harga" class="q-my-sm" dense outlined required :rules="hargaRules" />
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
import { ref, computed, defineEmits, defineProps } from 'vue'
import { useQuasar } from 'quasar'
import { useBarangStore } from 'src/stores/barang-store.js'

const $q = useQuasar()
const emits = defineEmits(['edited'])
const { barang } = defineProps(['barang'])
const barangStore = useBarangStore()
const data = ref({
  id: barang.id,
  name: barang.name,
  harga: barang.harga
})

// Validate
const nameRules = [(v) => !!v || 'Nama harus diisi', (v) => (v && v.length <= 255) || 'Nama tidak boleh lebih dari 255 karakter']
const hargaRules = [(v) => !!v || 'Harga harus diisi', (v) => (!isNaN(parseFloat(v)) && isFinite(v)) || 'Harga harus berupa angka']

// Disabled Button
const loading = ref(false)
const disabledButton = computed(() => {
  return loading.value || !data.value.name || !data.value.harga
})

// Edit Data
const editUser = async () => {
  loading.value = true

  try {
    await barangStore.edit(data.value)
    $q.notify({
      message: 'Berhasil Mengedit Barang',
      icon: 'check',
      color: 'positive'
    })
    emits('edited')
  } catch (error) {
    console.error('Error submitting form:', error)
    $q.notify({
      message: error.response.data.message || 'Gagal Mengedit Barang',
      icon: 'warning',
      color: 'negative'
    })
  }

  loading.value = false
}
</script>
