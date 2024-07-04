<template>
  <div>
    <q-form @submit="editKiloan">
      <q-card style="min-width: 400px">
        <q-card-section class="row items-center q-py-sm">
          <div class="text-h6">Edit Paket Kiloan</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-separator />

        <q-card-section class="scroll">
          <div class="row justify-center">
            <!-- Paket -->
            <div class="col-10">
              <div class="text-bold" style="margin-bottom: -10px">Nama Paket :</div>
              <q-input v-model="data.paket" label="Paket" class="q-my-sm" dense outlined required :rules="paketRules" autofocus />
            </div>

            <!-- Harga -->
            <div class="col-10">
              <div class="text-bold" style="margin-bottom: -10px">Harga :</div>
              <q-input v-model="data.harga" type="number" label="Harga" class="q-my-sm" dense outlined required :rules="hargaRules" />
            </div>

            <!-- Description -->
            <div class="col-10">
              <div class="text-bold" style="margin-bottom: -10px">Deskripsi :</div>
              <q-input v-model="data.description" type="textarea" label="Deskripsi" class="q-my-sm" dense outlined />
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
import { useKiloanStore } from '/src/stores/kiloan-store'

const $q = useQuasar()
const emits = defineEmits(['edited'])
const { kiloan } = defineProps(['kiloan'])
const kiloanStore = useKiloanStore()
const data = ref({
  id: kiloan.id,
  paket: kiloan.paket,
  harga: kiloan.harga,
  description: kiloan.description
})

// Validate
const paketRules = [(v) => !!v || 'Nama Paket harus diisi', (v) => (v && v.length <= 255) || 'Nama Paket tidak boleh lebih dari 255 karakter']
const hargaRules = [(v) => !!v || 'Harga harus diisi', (v) => (!isNaN(parseFloat(v)) && isFinite(v)) || 'Harga harus berupa angka']

// Disabled Button
const loading = ref(false)
const disabledButton = computed(() => {
  return loading.value || !data.value.paket || !data.value.harga
})

// Edit Data
const editKiloan = async () => {
  loading.value = true

  try {
    await kiloanStore.edit(data.value)
    $q.notify({
      message: 'Berhasil Mengedit Paket Kiloan',
      icon: 'check',
      color: 'positive'
    })
    emits('edited')
  } catch (error) {
    console.error('Error submitting form:', error)
    $q.notify({
      message: error.response.data.message || 'Gagal Mengedit Paket Kiloan',
      icon: 'warning',
      color: 'negative'
    })
  }

  loading.value = false
}
</script>
