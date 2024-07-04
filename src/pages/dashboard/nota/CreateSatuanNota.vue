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
            <div class="col-sm-3 col-xs-10">
              <div class="text-bold" style="margin-bottom: -10px">Nama Pelanggan :</div>
              <q-input v-model="data.nama_pelanggan" label="Nama Pelanggan" class="q-my-sm" dense outlined required :rules="nama_pelangganRules" />
            </div>

            <!-- Jenis Layanan -->
            <div class="col-sm-3 col-xs-10">
              <div class="text-bold">Jenis Layanan :</div>
              <q-select
                v-model="data.jenis_layanan"
                use-input
                hide-selected
                fill-input
                input-debounce="0"
                :options="jenislayananOptions"
                @filter="jenislayananFilter"
                label="Pilih Jenis Layanan"
                emit-value
                dense
                outlined
                required
                :rules="jenislayananRules"
              />
            </div>

            <!-- Waktu -->
            <div class="col-sm-3 col-xs-10">
              <div class="text-bold">Waktu :</div>
              <q-input v-model="data.waktu" class="q-mb-md" dense outlined>
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
          </div>

          <q-table flat bordered title="Barang" virtual-scroll :rows="rows" :columns="columns" row-key="id" :loading="loading" :rows-per-page-options="[10, 50, 100]">
            <!-- Tambah Row -->
            <template v-slot:header-cell-action="props">
              <q-th :props="props" class="q-gutter-sm">
                <q-btn color="primary" :disable="loading" label="Tambah" @click="addRow" />
              </q-th>
            </template>

            <!-- Pilih Barang -->
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td v-for="col in props.cols" :key="col.name">
                  <template v-if="col.name === 'barang'">
                    <q-select
                      v-model="props.row[col.name]"
                      use-input
                      hide-selected
                      fill-input
                      input-debounce="0"
                      :options="barangOptions"
                      @filter="barangFilter"
                      label="Pilih Barang"
                      emit-value
                      dense
                      outlined
                      required
                      :rules="getRules(col.name)"
                      @update:model-value="(val) => handleBarangSelection(val, props.row)"
                    />
                  </template>

                  <!-- Harga -->
                  <template v-else-if="col.name === 'harga'">
                    <q-input v-model="props.row[col.name]" label="Harga" dense outlined readonly :rules="getRules(col.name)" style="min-width: 150px; margin-bottom: 20px" />
                  </template>

                  <!-- Jumlah Barang -->
                  <template v-else-if="col.name === 'jumlah_barang'">
                    <q-input v-model="props.row[col.name]" label="Jumlah" dense outlined required :rules="getRules(col.name)" style="min-width: 100px" />
                  </template>

                  <!-- Total Harga -->
                  <template v-else-if="col.name === 'total_harga'">
                    <q-input v-model="props.row[col.name]" label="Total" dense outlined readonly :rules="getRules(col.name)" style="min-width: 150px" />
                  </template>

                  <!-- Delete Row -->
                  <template v-else-if="col.name === 'action'">
                    <div class="row justify-center">
                      <q-btn dense round color="red" icon="delete" @click="removeRow(props.row)" />
                    </div>
                  </template>
                </q-td>
              </q-tr>
            </template>
          </q-table>

          <div class="row q-mt-md">
            <div class="col-5"></div>

            <div class="col-md-5 col-sm-8 col-xs-8 q-ml-auto">
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
import { rupiah } from '/src/boot/rupiah'
import { useNotaStore } from '/src/stores/nota-store'
import { useJenisLayananStore } from '/src/stores/jenislayanan-store'
import { useBarangStore } from '/src/stores/barang-store'

const $q = useQuasar()
const emits = defineEmits(['added'])
const notaStore = useNotaStore()
const data = ref({
  nama_pelanggan: '',
  jenis_layanan_id: null,
  jenis_layanan: '',
  waktu: getCurrentDateTime(),
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

// Get Jenis Layanan
const jenislayananStore = useJenisLayananStore()
const jenislayanans = ref([])
const jenislayananOptions = ref([])
const getJenisLayanan = async () => {
  try {
    const res = await jenislayananStore.all()

    jenislayanans.value = res.data.data.map((jenislayanan) => ({
      id: jenislayanan.id,
      label: jenislayanan.jenis_cuci + ' (' + rupiah(jenislayanan.harga) + ')',
      value: jenislayanan.jenis_cuci,
      harga: jenislayanan.harga
    }))
    jenislayananOptions.value = [...jenislayanans.value]
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}
const jenislayananFilter = (val, update, abort) => {
  update(() => {
    const needle = val.toLowerCase()
    jenislayananOptions.value = jenislayanans.value.filter((option) => {
      return option.value.toLowerCase().indexOf(needle) > -1
    })
  })
}

// Get Barang
const barangStore = useBarangStore()
const barangs = ref([])
const barangOptions = ref([])
const getBarang = async () => {
  try {
    const res = await barangStore.all()

    barangs.value = res.data.data.map((barang) => ({
      label: barang.name,
      value: barang.name,
      harga: barang.harga
    }))
    barangOptions.value = [...barangs.value]
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}
const barangFilter = (val, update, abort) => {
  update(() => {
    const needle = val.toLowerCase()
    barangOptions.value = barangs.value.filter((option) => {
      return option.value.toLowerCase().indexOf(needle) > -1
    })
  })
}
const handleBarangSelection = (selectedBarang, row) => {
  const foundBarang = barangs.value.find((barang) => barang.value === selectedBarang)
  if (foundBarang) {
    row.harga = foundBarang.harga
  }
}
onMounted(() => {
  getJenisLayanan()
  getBarang()
})

// Validate
const jenislayananRules = [(v) => !!v || 'Jenis Layanan harus diisi']
const nama_pelangganRules = [(v) => !!v || 'Nama Pelanggan harus diisi']
const barangRules = [(v) => !!v || 'Barang harus diisi']
const jumlah_barangRules = [(v) => !!v || 'Jumlah Barang harus diisi', (v) => /^[0-9]+$/.test(v) || 'Jumlah Barang harus berupa angka']
const total_hargaRules = [(v) => !!v || 'Total Harga harus diisi', (v) => /^[0-9]+$/.test(v) || 'Total Harga harus berupa angka']
const diskonRules = [(v) => /^[0-9]+$/.test(v) || 'Diskon harus berupa angka']

// Disabled Button
const loading = ref(false)
const disabledButton = computed(() => {
  return loading.value || !data.value.nama_pelanggan || !data.value.jenis_layanan || !data.value.total_harga || !data.value.jumlah
})

// Table
const defaultRow = {
  barang: '',
  harga: 0,
  jumlah_barang: '',
  total_harga: ''
}
const columns = [
  { name: 'barang', required: true, label: 'Barang', align: 'left', sortable: false },
  { name: 'harga', label: 'Harga', align: 'left', sortable: false },
  { name: 'jumlah_barang', label: 'Jumlah Barang', align: 'left', sortable: false },
  { name: 'total_harga', label: 'Total Harga', align: 'left', sortable: false },
  { name: 'action', label: 'Tambah', align: 'center', sortable: false }
]
const originalRows = [{ ...defaultRow }]
const rows = ref([...originalRows])

// Create row
const addRow = () => {
  const newRow = {}
  columns.forEach((col) => {
    newRow[col.name] = ''
  })
  rows.value.push(newRow)
}

// Delete Row
const removeRow = (row) => {
  if (rows.value.length > 1) {
    rows.value.pop(row)
  } else {
    $q.notify({
      message: 'Baris pertama tidak dapat dihapus',
      icon: 'warning',
      color: 'negative'
    })
  }
}

// Rules
const getRules = (fieldName) => {
  switch (fieldName) {
    case 'barang':
      return barangRules
    case 'jumlah_barang':
      return jumlah_barangRules
    case 'total_harga':
      return total_hargaRules
    default:
      return []
  }
}

// Column Total Harga
const calculateTotalHarga = () => {
  rows.value.forEach((row) => {
    const harga = parseFloat(row.harga)
    const jumlah_barang = parseFloat(row.jumlah_barang)

    if (!isNaN(harga) && !isNaN(jumlah_barang)) {
      row.total_harga = harga * jumlah_barang
    } else {
      row.total_harga = 0
    }
  })
}

// Total Harga
const calculateTotal = () => {
  let total = 0
  rows.value.forEach((row) => {
    const total_harga = parseFloat(row.total_harga)
    if (!isNaN(total_harga)) {
      total += total_harga
    }
  })
  if (data.value.jenis_layanan) {
    const jenislayananHarga = jenislayanans.value.find((dept) => dept.value === data.value.jenis_layanan).harga
    total = total + parseFloat(jenislayananHarga)
  }

  data.value.total_harga = total
}

// Jumlah
const calculateJumlah = () => {
  let jumlah = 0
  const money = data.value.total_harga
  const diskon = data.value.diskon / 100
  const amount = money * diskon
  jumlah = money - amount

  data.value.jumlah = jumlah
}
watchEffect(() => {
  calculateTotalHarga()
  calculateTotal()
  calculateJumlah()
})

// Create Data
const addNota = async () => {
  loading.value = true

  try {
    data.value.jenis_layanan_id = jenislayanans.value.find((dept) => dept.value === data.value.jenis_layanan).id

    const res = await notaStore.createSatuan(data.value)

    await rows.value.forEach(async (data) => {
      data.nota_id = res.data.data.id
      await notaStore.createSatuanBarang(data)
    })

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
</script>
