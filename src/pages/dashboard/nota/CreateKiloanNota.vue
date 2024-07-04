<template>
  <div>
    <q-form @submit="addNota">
      <q-card style="min-width: 400px">
        <q-card-section class="row items-center q-py-sm">
          <div class="text-h6">Nota Pembelian</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-separator />

        <q-card-section class="scroll" style="max-height: 75vh">
          <div class="row justify-center q-gutter-md">
            <!-- Nama Pelanggan -->
            <div class="col-sm-5 col-xs-10">
              <div class="text-bold" style="margin-bottom: -10px">Nama Pelanggan :</div>
              <q-input v-model="data.nama_pelanggan" label="Nama Pelanggan" class="q-my-sm" dense outlined required :rules="nama_pelangganRules" />
            </div>

            <!-- Waktu -->
            <div class="col-sm-5 col-xs-10">
              <div class="text-bold">Waktu :</div>
              <q-input v-model="data.waktu" dense outlined>
                <template v-slot:prepend>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="data.waktu" mask="YYYY-MM-DD HH:mm">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Close" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>

                <template v-slot:append>
                  <q-icon name="access_time" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-time v-model="data.waktu" mask="YYYY-MM-DD HH:mm" format24h>
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Close" color="primary" flat />
                        </div>
                      </q-time>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>

            <!-- Paket Kiloan -->
            <div class="col-sm-5 col-xs-10">
              <div class="text-bold">Paket Kiloan :</div>
              <q-select
                v-model="data.kiloan"
                use-input
                hide-selected
                fill-input
                input-debounce="0"
                :options="kiloanOptions"
                @filter="kiloanFilter"
                label="Pilih Paket Kiloan"
                emit-value
                dense
                outlined
                required
                :rules="kiloanRules"
              />
            </div>

            <!-- Berat -->
            <div class="col-sm-5 col-xs-10">
              <div class="text-bold" style="margin-bottom: -10px">Berat :</div>
              <q-input v-model="data.berat" type="number" label="Berat" class="q-my-sm" dense outlined required :rules="beratRules">
                <template v-slot:append>kg</template>
              </q-input>
            </div>
          </div>

          <div class="row q-mt-md">
            <div class="col-5"></div>

            <div class="col-5 q-ml-auto">
              <!-- Total Harga -->
              <div class="row">
                <div class="col-5">
                  <div class="text-bold q-my-md">Total Harga :</div>
                </div>
                <div class="col-7">
                  <q-input v-model="data.total_harga" label="Total Harga" class="q-my-sm" dense outlined readonly />
                </div>
              </div>

              <!-- Diskon -->
              <div class="row">
                <div class="col-5">
                  <div class="text-bold q-my-md">Diskon :</div>
                </div>
                <div class="col-7">
                  <q-input v-model="data.diskon" label="Diskon" class="q-my-sm" dense outlined required :rules="diskonRules">
                    <template v-slot:append>
                      <div>%</div>
                    </template>
                  </q-input>
                </div>
              </div>

              <!-- Jumlah Bersih -->
              <div class="row" style="margin-top: -20px">
                <div class="col-5">
                  <div class="text-bold q-my-md">Jumlah Bersih :</div>
                </div>
                <div class="col-7">
                  <q-input v-model="data.jumlah" label="Jumlah Bersih" class="q-my-sm" dense outlined readonly />
                </div>
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
import { ref, onMounted, computed, watchEffect, defineEmits } from 'vue'
import { useQuasar } from 'quasar'
import { useNotaStore } from 'src/stores/nota-store'
import { useKiloanStore } from 'src/stores/kiloan-store'
import { useJenisLayananStore } from 'src/stores/jenislayanan-store'

const $q = useQuasar()
const emits = defineEmits(['added'])
const notaStore = useNotaStore()
const data = ref({
  nama_pelanggan: '',
  waktu: getCurrentDateTime(),
  kiloan_id: null,
  kiloan: '',
  berat: 1,
  total_harga: 0,
  diskon: 0,
  jumlah: 0
})

function getCurrentDateTime() {
  const now = new Date()
  const year = now.getFullYear()
  const month = (now.getMonth() + 1).toString().padStart(2, '0')
  const day = now.getDate().toString().padStart(2, '0')
  const hours = now.getHours().toString().padStart(2, '0')
  const minutes = now.getMinutes().toString().padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}`
}

// Get Paket Kiloan
const kiloanStore = useKiloanStore()
const kiloans = ref([])
const kiloanOptions = ref([])
const getKiloan = async () => {
  try {
    const res = await kiloanStore.all()

    kiloans.value = res.data.data.map((kiloan) => ({
      id: kiloan.id,
      label: kiloan.paket + ' (' + formatCurrency(kiloan.harga) + ')' + ' (' + kiloan.description + ')',
      value: kiloan.paket,
      harga: kiloan.harga
    }))
    kiloanOptions.value = [...kiloans.value]
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}
const kiloanFilter = (val, update, abort) => {
  update(() => {
    const needle = val.toLowerCase()
    kiloanOptions.value = kiloans.value.filter((option) => {
      return option.value.toLowerCase().indexOf(needle) > -1
    })
  })
}

// Total Harga
const calculateTotalHarga = () => {
  let total = 0
  const foundKiloan = kiloans.value.find((kiloan) => kiloan.value === data.value.kiloan)
  if (foundKiloan) {
    total = data.value.berat * foundKiloan.harga
  }

  data.value.total_harga = total
}

// Jumlah Harga
const calculateJumlah = () => {
  let jumlah = data.value.total_harga
  const money = data.value.total_harga
  const diskon = data.value.diskon / 100
  const amount = money * diskon
  jumlah = money - amount

  data.value.jumlah = jumlah
}
onMounted(() => {
  getKiloan()
})
watchEffect(() => {
  calculateTotalHarga()
  calculateJumlah()
})

// Validate
const nama_pelangganRules = [(v) => !!v || 'Nama Pelanggan harus diisi']
const kiloanRules = [(v) => !!v || 'Paket Kiloan harus diisi']
const beratRules = [(v) => !!v || 'Berat harus diisi', (v) => /^[0-9]+$/.test(v) || 'Berat harus berupa angka']
const diskonRules = [(v) => /^[0-9]+$/.test(v) || 'Diskon harus berupa angka']

// Disabled Button
const loading = ref(false)
const disabledButton = computed(() => {
  return loading.value || !data.value.nama_pelanggan || !data.value.kiloan || !data.value.berat || !data.value.total_harga || !data.value.jumlah
})

// Create Data
const addNota = async () => {
  loading.value = true

  try {
    data.value.kiloan_id = kiloans.value.find((dept) => dept.value === data.value.kiloan).id

    await notaStore.createKiloan(data.value)

    $q.notify({
      message: 'Berhasil Membuat Nota',
      icon: 'check',
      color: 'positive'
    })
    emits('added')
  } catch (error) {
    console.error('Error submitting form:', error)
    $q.notify({
      message: error.response.data.message || 'Gagal Membuat Nota',
      icon: 'warning',
      color: 'negative'
    })
  }

  loading.value = false
}

const formatCurrency = (amount) => {
  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR'
  })
  return formatter.format(amount)
}
</script>
