<template>
  <q-page class="q-pa-sm">
    <q-table
      class="dashboard-table"
      :table-header-class="$q.dark.isActive ? 'bg-blue-grey-10' : 'bg-grey-2'"
      title="Nota"
      row-key="__index"
      :rows="currencyData"
      :columns="currencyColumns"
      :hide-header="grid"
      :grid="grid"
      :filter="filter"
      v-model:pagination="pagination"
      :rows-per-page-options="[10, 20, 30]"
      :separator="tableseparator"
      virtual-scroll
      flat
      bordered
    >
      <!-- Top -->
      <template v-slot:top-right="props">
        <!-- Fullscreen -->
        <q-btn :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'" class="q-ma-xs" @click="setFs(props)" flat round dense>
          <q-tooltip>{{ props.inFullscreen ? 'Exit Fullscreen' : 'Toggle Fullscreen' }}</q-tooltip>
        </q-btn>

        <!-- Grid Switch -->
        <q-btn :icon="grid ? 'list' : 'grid_on'" @click="grid = !grid" class="q-ma-xs" flat round dense>
          <q-tooltip>{{ grid ? 'List' : 'Grid' }}</q-tooltip>
        </q-btn>

        <!-- Export -->
        <q-btn icon="file_download" @click="exportToExcel" flat round dense>
          <q-tooltip>Ekspor</q-tooltip>
        </q-btn>

        <!-- Table Types -->
        <q-select v-model="tableseparator" :options="['horizontal', 'vertical', 'cell', 'none']" label="Tipe Tabel" class="q-ma-xs" style="width: 120px" outlined dense />

        <!-- Search -->
        <q-input outlined dense debounce="300" v-model="filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

      <!-- Create Nota -->
      <template v-slot:top-left>
        <div class="text-h5 q-pr-lg">Nota</div>

        <!-- Barang Satuan -->
        <q-btn @click="addSatuanNotaDialog = true" color="black" label="Barang Satuan" class="shadow-3 q-ma-sm">
          <q-dialog v-model="addSatuanNotaDialog" transition-show="slide-up" transition-hide="slide-down" full-width full-height persistent>
            <CreateSatuanNota @added="notaCreateed" />
          </q-dialog>
        </q-btn>

        <!-- Paket Kiloan -->
        <q-btn @click="addKiloanNotaDialog = true" color="black" label="Paket Kiloan" class="shadow-3 q-ma-sm">
          <q-dialog v-model="addKiloanNotaDialog" transition-show="slide-up" transition-hide="slide-down" full-width full-height persistent>
            <CreateKiloanNota @added="notaCreateed" />
          </q-dialog>
        </q-btn>
      </template>

      <!-- Table -->
      <!-- ID -->
      <template #body-cell-id="props">
        <q-td :props="props">
          {{ props.rowIndex + 1 }}
        </q-td>
      </template>

      <!-- Nomor Nota -->
      <template #body-cell-no_nota="props">
        <q-td :props="props">
          <div class="bg-blue-2 q-py-xs">
            <div class="text-blue-9 text-center">{{ props.row.no_nota }}</div>
          </div>
        </q-td>
      </template>

      <!-- Waktu Pemesanan -->
      <template #body-cell-waktu="props">
        <q-td :props="props">
          <div class="bg-yellow-3 q-py-xs">
            <div class="text-yellow-10 text-center">{{ props.row.waktu }}</div>
          </div>
        </q-td>
      </template>

      <!-- jenis Pemesanan -->
      <template #body-cell-jenis="props">
        <q-td :props="props">
          <div v-if="props.row.jenis === 'Paket Kiloan'" class="bg-light-green-2 q-pa-xs q-px-sm">
            <div class="text-light-green-9 text-center">{{ props.row.jenis }}</div>
          </div>

          <div v-if="props.row.jenis === 'Barang Satuan'" class="bg-teal-2 q-py-xs q-px-sm">
            <div class="text-teal-9 text-center">{{ props.row.jenis }}</div>
          </div>
        </q-td>
      </template>

      <!-- Jumlah -->
      <template #body-cell-jumlah="props">
        <q-td :props="props">
          <div class="text-subtitle2 text-primary text-bold">{{ rupiah(props.row.jumlah) }}</div>
        </q-td>
      </template>

      <!-- Diskon -->
      <template #body-cell-diskon="props">
        <q-td :props="props">
          <div class="text-subtitle2 text-red text-bold">{{ props.row.diskon }}%</div>
        </q-td>
      </template>

      <!-- Total Harga -->
      <template #body-cell-total_harga="props">
        <q-td :props="props">
          <div class="text-subtitle2 text-primary text-bold">{{ rupiah(props.row.total_harga) }}</div>
        </q-td>
      </template>

      <!-- Action -->
      <template #body-cell-action="props">
        <q-td :props="props">
          <q-btn dense round color="blue" field="show" icon="visibility" class="q-ma-xs" @click="showNota(props.row)" />
          <q-btn dense round color="red" field="delete" icon="delete" class="q-ma-xs" @click="deleteNotaDialog(props.row)" />
        </q-td>
      </template>

      <!-- Grid -->
      <template v-slot:item="props">
        <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition" :style="props.selected ? 'transform: scale(0.95);' : ''">
          <q-card>
            <q-list dense>
              <q-item v-for="col in props.cols" :key="col.id">
                <q-item-section>
                  <q-item-label>{{ col.label }}</q-item-label>
                </q-item-section>

                <q-item-section side>
                  <!-- ID -->
                  <div v-if="col.name === 'id'">
                    {{ props.rowIndex + 1 }}
                  </div>

                  <!-- Nomor Nota -->
                  <div v-else-if="col.name === 'no_nota'">
                    <div class="bg-blue-2 q-py-xs q-px-md">
                      <div class="text-blue-9 text-center">{{ props.row.no_nota }}</div>
                    </div>
                  </div>

                  <!-- Waktu Pemesanan -->
                  <div v-else-if="col.name === 'waktu'">
                    <div class="bg-yellow-3 q-py-xs q-px-md">
                      <div class="text-yellow-10 text-center">{{ props.row.waktu }}</div>
                    </div>
                  </div>

                  <!-- jenis Pemesanan -->
                  <div v-else-if="col.name === 'jenis'">
                    <div v-if="props.row.jenis === 'Paket Kiloan'" class="bg-light-green-2 q-pa-xs q-px-sm">
                      <div class="text-light-green-9 text-center">{{ props.row.jenis }}</div>
                    </div>

                    <div v-if="props.row.jenis === 'Barang Satuan'" class="bg-teal-2 q-py-xs q-px-sm">
                      <div class="text-teal-9 text-center">{{ props.row.jenis }}</div>
                    </div>
                  </div>

                  <!-- Total | Jumlah -->
                  <div v-else-if="col.name === 'total_harga' || col.name === 'jumlah'">
                    <div class="text-subtitle2 text-primary text-bold">{{ rupiah(props.row[col.name]) }}</div>
                  </div>

                  <!-- Diskon -->
                  <div v-else-if="col.name === 'diskon'">
                    <div class="text-subtitle2 text-red text-bold">{{ props.row.diskon }}%</div>
                  </div>

                  <!-- Action -->
                  <div v-else-if="col.name === 'action'">
                    <q-btn dense round color="blue" field="show" icon="visibility" class="q-ma-xs" @click="showNota(props.row)" />
                    <q-btn dense round color="red" field="delete" icon="delete" class="q-ma-xs" @click="deleteNotaDialog(props.row)" />
                  </div>

                  <!-- DLL -->
                  <q-item-label v-else caption :class="col.classes ? col.classes : ''">{{ col.value }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </div>
      </template>
    </q-table>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import * as XLSX from 'xlsx'
import { rupiah } from '/src/boot/rupiah'
import { useNotaStore } from '/src/stores/nota-store'
import CreateKiloanNota from './CreateKiloanNota.vue'
import CreateSatuanNota from './CreateSatuanNota.vue'

const $q = useQuasar()
const router = useRouter()
const notaStore = useNotaStore()

// Get Nota
const notas = ref([])
const getNota = async () => {
  try {
    const res = await notaStore.all()
    notas.value = res.data.data

    if (res.data.response === 'Gagal') {
      router.push('/notfound')
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}
onMounted(() => {
  getNota()
})

// Create Nota
const addKiloanNotaDialog = ref(false)
const addSatuanNotaDialog = ref(false)
const notaCreateed = () => {
  addKiloanNotaDialog.value = false
  addSatuanNotaDialog.value = false
  getNota()
}

// Show Nota
const showNota = (data) => {
  router.push({ name: 'dashboard.shownota', params: { id: data.id } })
}

// Delete Nota
const deleteNotaDialog = (row) => {
  $q.dialog({
    title: 'WARNING!',
    message: 'Apakah kamu yakin ingin menghapus data ini?',
    cancel: true,
    persistent: true,
    ok: {
      label: 'Ya',
      color: 'primary'
    },
    cancel: {
      label: 'Tidak',
      color: 'red-7'
    }
  }).onOk(() => {
    deleteNota(row)
  })
}
const deleteNota = async (row) => {
  try {
    await notaStore.delete(row.id)
    $q.notify({
      message: 'Berhasil Menghapus Nota',
      icon: 'check',
      color: 'positive'
    })
    getNota()
  } catch (error) {
    console.error('Error submitting form:', error)
    $q.notify({
      message: error.response.data.message || 'Gagal Menghapus Nota',
      icon: 'warning',
      color: 'negative'
    })
  }
}

// Table
const currencyData = notas
const currencyColumns = [
  {
    name: 'id',
    field: 'id',
    label: 'No',
    align: 'center',
    headerStyle: 'font-weight: bolder; font-size: 13px;'
  },
  {
    name: 'no_nota',
    field: 'no_nota',
    label: 'Nomor Nota',
    align: 'center',
    sortable: true,
    headerStyle: 'font-weight: bolder; font-size: 13px;'
  },
  {
    name: 'waktu',
    field: 'waktu',
    label: 'Waktu Pemesanan',
    align: 'left',
    sortable: true,
    headerStyle: 'font-weight: bolder; font-size: 13px;'
  },
  {
    name: 'jenis',
    field: 'jenis',
    label: 'Jenis Pemesanan',
    align: 'center',
    sortable: true,
    headerStyle: 'font-weight: bolder; font-size: 13px;'
  },
  {
    name: 'jumlah',
    field: 'jumlah',
    label: 'Jumlah Awal',
    align: 'center',
    sortable: true,
    headerStyle: 'font-weight: bolder; font-size: 13px;'
  },
  {
    name: 'diskon',
    field: 'diskon',
    label: 'Diskon',
    align: 'center',
    sortable: true,
    headerStyle: 'font-weight: bolder; font-size: 13px;'
  },
  {
    name: 'total_harga',
    field: 'total_harga',
    label: 'Total Harga',
    align: 'center',
    sortable: true,
    headerStyle: 'font-weight: bolder; font-size: 13px;'
  },
  {
    name: 'action',
    field: 'action',
    label: 'Action',
    align: 'center',
    headerStyle: 'font-weight: bolder; font-size: 13px;'
  }
]
const tableseparator = ref('cell')
const filter = ref('')
const grid = ref(false)
const pagination = ref({})
const setFs = (props) => {
  props.toggleFullscreen()
}

// Export
const exportToExcel = () => {
  const data = notas.value.map((nota, index) => ({
    No: index + 1,
    'Nomor Nota': nota.no_nota,
    'Waktu Pemesanan': nota.waktu,
    'Jenis Pemesanan': nota.jenis,
    'Jumlah Awal': nota.jumlah,
    Diskon: nota.diskon + '%',
    'Total Harga': nota.total_harga
  }))

  const ws = XLSX.utils.json_to_sheet(data)

  // Set column widths slightly wider than max length
  const maxLengths = data.reduce((acc, row) => {
    Object.keys(row).forEach((key) => {
      const value = row[key].toString()
      if (!acc[key] || acc[key] < value.length) {
        acc[key] = value.length
      }
    })
    return acc
  }, {})

  ws['!cols'] = Object.keys(maxLengths).map((key) => ({ wch: maxLengths[key] + 2 }))

  // Center the data and apply styles
  Object.keys(ws).forEach((cell) => {
    if (cell[0] !== '!') {
      ws[cell].s = {
        alignment: { horizontal: 'center' },
        fill: {}
      }
      if (ws[cell].v && ws[cell].v.toString().includes('Nomor Nota')) {
        ws[cell].s.fill = {
          fgColor: { rgb: 'FFFF00' } // Yellow background for Nomor Nota column
        }
      }
    }
  })

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Nota')
  XLSX.writeFile(wb, 'nota.xlsx')
}
</script>

<style scoped>
.bg-blue-2 {
  border-radius: 20px;
}
.bg-light-green-2,
.bg-teal-2 {
  border-radius: 6px;
}
</style>
