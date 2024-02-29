<template>
  <div>
    <q-form @submit="editUser">
      <q-card style="min-width: 400px">
        <q-card-section class="row items-center q-py-sm">
          <div class="text-h6">Edit Jenis Layana</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-separator />

        <q-card-section class="scroll">
          <div class="row justify-center">
            <!-- Jenis Cuci -->
            <div class="col-10">
              <div class="text-bold" style="margin-bottom: -10px">Jenis Cuci :</div>
              <q-input v-model="data.jenis_cuci" label="Jenis Cuci" class="q-my-sm" dense outlined required :rules="jenis_cuciRules" autofocus />
            </div>

            <!-- Waktu -->
            <div class="col-10">
              <div class="text-bold" style="margin-bottom: -10px">Waktu :</div>
              <q-input v-model="data.waktu" label="Waktu" class="q-my-sm" dense outlined required :rules="waktuRules" autofocus />
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
import { useJenisLayananStore } from 'src/stores/jenislayanan-store.js'

const $q = useQuasar()
const emits = defineEmits(['edited'])
const { jenisLayanan } = defineProps(['jenisLayanan'])
const jenisLayananStore = useJenisLayananStore()
const data = ref({
  id: jenisLayanan.id,
  jenis_cuci: jenisLayanan.jenis_cuci,
  waktu: jenisLayanan.waktu,
  harga: jenisLayanan.harga
})

// Validate
const jenis_cuciRules = [(v) => !!v || 'Jenis Cuci harus diisi', (v) => (v && v.length <= 255) || 'Jenis Cuci tidak boleh lebih dari 255 karakter']
const waktuRules = [(v) => !!v || 'Waktu harus diisi', (v) => (v && v.length <= 255) || 'Waktu tidak boleh lebih dari 255 karakter']
const hargaRules = [(v) => !!v || 'Harga harus diisi', (v) => (!isNaN(parseFloat(v)) && isFinite(v)) || 'Harga harus berupa angka']

// Disabled Button
const loading = ref(false)
const disabledButton = computed(() => {
  return loading.value || !data.value.jenis_cuci || !data.value.waktu || !data.value.harga
})

// Edit Data
const editUser = async () => {
  loading.value = true

  try {
    await jenisLayananStore.edit(data.value)
    $q.notify({
      message: 'Berhasil Mengedit Jenis Layanan',
      icon: 'check',
      color: 'positive'
    })
    emits('edited')
  } catch (error) {
    console.error('Error submitting form:', error)
    $q.notify({
      message: error.response.data.message || 'Gagal Mengedit Jenis Layanan',
      icon: 'warning',
      color: 'negative'
    })
  }

  loading.value = false
}
</script>
