<template>
  <q-page class="q-pa-sm">
    <q-table
      flat
      bordered
      title="Nota"
      :rows="currencyData"
      :hide-header="grid"
      :columns="currencyColumns"
      row-key="__index"
      :grid="grid"
      :filter="filter"
      virtual-scroll
      v-model:pagination="pagination"
      :rows-per-page-options="[10, 20, 30]"
    >
      <!-- Top -->
      <template v-slot:top-right="props">
        <!-- Fullscreen -->
        <q-btn flat round dense :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'" @click="setFs(props)">
          <q-tooltip>{{ props.inFullscreen ? 'Exit Fullscreen' : 'Toggle Fullscreen' }}</q-tooltip>
        </q-btn>

        <!-- Grid Switch -->
        <q-btn flat round dense :icon="grid ? 'list' : 'grid_on'" @click="grid = !grid" class="q-mr-sm">
          <q-tooltip>{{ grid ? 'List' : 'Grid' }}</q-tooltip>
        </q-btn>

        <!-- Search -->
        <q-input outlined dense debounce="300" v-model="filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

      <!-- Add Nota -->
      <template v-slot:top-left>
        <div class="text-h5 q-pr-lg">Nota</div>
        <!-- Barang Satuan -->
        <q-btn @click="addSatuanNotaDialog = true" color="black" label="Barang Satuan" class="shadow-3 q-mx-sm"></q-btn>
        <q-dialog v-model="addSatuanNotaDialog" full-width full-height persistent transition-show="slide-up" transition-hide="slide-down">
          <AddSatuanNota @added="notaAdded" />
        </q-dialog>

        <!-- Paket Kiloan -->
        <q-btn @click="addKiloanNotaDialog = true" color="black" label="Paket Kiloan" class="shadow-3 q-mx-sm"></q-btn>
        <q-dialog v-model="addKiloanNotaDialog" full-width full-height persistent transition-show="slide-up" transition-hide="slide-down">
          <AddKiloanNota @added="notaAdded" />
        </q-dialog>
      </template>

      <!-- Table -->
      <!-- ID -->
      <template #body-cell-id="props">
        <q-td :props="props">
          <div text-color="white" dense square>
            {{ props.rowIndex + 1 }}
          </div>
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
          <div v-if="props.row.jenis === 'Paket Kiloan'" class="bg-light-green-2 q-py-xs">
            <div class="text-light-green-9 text-center">{{ props.row.jenis }}</div>
          </div>
          <div v-if="props.row.jenis === 'Barang Satuan'" class="bg-teal-2 q-py-xs">
            <div class="text-teal-9 text-center">{{ props.row.jenis }}</div>
          </div>
        </q-td>
      </template>

      <!-- Jumlah -->
      <template #body-cell-jumlah="props">
        <q-td :props="props">
          <div text-color="white" dense square>
            {{ formatCurrency(props.row.jumlah) }}
          </div>
        </q-td>
      </template>

      <!-- Diskon -->
      <template #body-cell-diskon="props">
        <q-td :props="props">
          <div text-color="white" dense square>{{ props.row.diskon }}%</div>
        </q-td>
      </template>

      <!-- Total Harga -->
      <template #body-cell-total_harga="props">
        <q-td :props="props">
          <div text-color="white" dense square>
            {{ formatCurrency(props.row.total_harga) }}
          </div>
        </q-td>
      </template>

      <!-- Action -->
      <template #body-cell-action="props">
        <q-td :props="props">
          <q-btn dense round color="blue" field="show" icon="visibility" class="q-mx-xs" @click="showNota(props.row)" />
          <q-btn dense round color="red" field="delete" icon="delete" class="q-mx-xs" @click="deleteNotaDialog(props.row)" />
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
                  <div v-if="col.name === 'id'" text-color="white" dense square>
                    {{ props.rowIndex + 1 }}
                  </div>

                  <!-- Nomor Nota -->
                  <div v-else-if="col.name === 'no_nota'" text-color="white" dense square>
                    <div class="bg-blue-2 q-py-xs q-px-md">
                      <div class="text-blue-9 text-center">{{ props.row.no_nota }}</div>
                    </div>
                  </div>

                  <!-- Nomor Nota -->
                  <div v-else-if="col.name === 'waktu'" text-color="white" dense square>
                    <div class="bg-yellow-3 q-py-xs q-px-md">
                      <div class="text-yellow-10 text-center">{{ props.row.waktu }}</div>
                    </div>
                  </div>

                  <!-- Total | Jumlah -->
                  <div v-else-if="col.name === 'total' || col.name === 'jumlah'">
                    {{ formatCurrency(props.row[col.name]) }}
                  </div>

                  <!-- Diskon -->
                  <div v-else-if="col.name === 'discount'">{{ props.row.discount }}%</div>

                  <!-- Action -->
                  <div v-else-if="col.name === 'action'">
                    <q-btn dense round color="blue" field="show" icon="visibility" class="q-mx-xs" @click="showNota(props.row)" />
                    <q-btn dense round color="red" field="delete" icon="delete" class="q-mx-xs" @click="deleteNotaDialog(props.row)" />
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
import { url } from 'src/boot/axios'
import { useNotaStore } from 'src/stores/nota-store'
import AddKiloanNota from './AddKiloanNota.vue'
import AddSatuanNota from './AddSatuanNota.vue'

const $q = useQuasar()
const router = useRouter()
const notaStore = useNotaStore()

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
const notaAdded = () => {
  addKiloanNotaDialog.value = false
  addSatuanNotaDialog.value = false
  getNota()
}

// Show Nota
const showNota = (data) => {
  router.push({ name: 'dashboardshownota', params: { id: data.id } })
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
    label: 'ID'
  },
  {
    name: 'no_nota',
    field: 'no_nota',
    label: 'Nomor Nota',
    align: 'left',
    sortable: true
  },
  {
    name: 'waktu',
    field: 'waktu',
    label: 'Waktu Pemesanan',
    align: 'left',
    sortable: true
  },
  {
    name: 'jenis',
    field: 'jenis',
    label: 'Jenis Pemesanan',
    align: 'left',
    sortable: true
  },
  {
    name: 'jumlah',
    field: 'jumlah',
    label: 'Jumlah Awal',
    align: 'left',
    sortable: true
  },
  {
    name: 'diskon',
    field: 'diskon',
    label: 'Diskon',
    align: 'left',
    sortable: true
  },
  {
    name: 'total_harga',
    field: 'total_harga',
    label: 'Total Harga',
    align: 'left',
    sortable: true
  },
  {
    name: 'action',
    field: 'action',
    label: 'Action',
    align: 'center'
  }
]
const filter = ref('')
const grid = ref(false)
const pagination = ref({})
const setFs = (props) => {
  props.toggleFullscreen()
}

// Format uang sesuai dengan mata uang Rupiah
const formatCurrency = (amount) => {
  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR'
  })
  return formatter.format(amount)
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
