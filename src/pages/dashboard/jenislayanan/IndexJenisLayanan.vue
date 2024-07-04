<template>
  <q-page class="q-pa-sm">
    <q-table
      class="dashboard-table"
      :table-header-class="$q.dark.isActive ? 'bg-blue-grey-10' : 'bg-grey-2'"
      title="Jenis Layanan"
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

        <!-- Table Types -->
        <q-select v-model="tableseparator" :options="['horizontal', 'vertical', 'cell', 'none']" label="Tipe Tabel" class="q-ma-xs" style="width: 120px" outlined dense />

        <!-- Search -->
        <q-input outlined dense debounce="300" v-model="filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

      <!-- Create Jenis Layanan -->
      <template v-slot:top-left>
        <div class="text-h5 q-pr-lg">Jenis Layanan</div>

        <q-btn dense @click="addJenisLayananDialog = true" color="black" icon="add" class="shadow-3">
          <q-tooltip>Create JenisLayanan</q-tooltip>
          <q-dialog v-model="addJenisLayananDialog" persistent>
            <CreateJenisLayanan @added="jenisLayananCreateed" />
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

      <!-- Harga -->
      <template #body-cell-harga="props">
        <q-td :props="props">
          <div class="text-subtitle2 text-primary text-bold">{{ formatCurrency(props.row.harga) }}</div>
        </q-td>
      </template>

      <!-- Action -->
      <template #body-cell-action="props">
        <q-td :props="props">
          <q-btn color="blue" field="edit" icon="edit" class="q-ma-xs" @click="editJenisLayanan(props.row)" dense round>
            <q-dialog v-model="editJenisLayananDialog" persistent>
              <EditJenisLayanan @edited="jenisLayananEdited(props.row)" :jenisLayanan="jenisLayananData" />
            </q-dialog>
          </q-btn>
          <q-btn color="red" field="delete" icon="delete" class="q-ma-xs" @click="deleteJenisLayananDialog(props.row)" dense round />
        </q-td>
      </template>

      <!-- Grid -->
      <template v-slot:item="props">
        <div class="q-pa-md col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition" :style="props.selected ? 'transform: scale(0.95);' : ''">
          <q-card class="q-pa-sm">
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

                  <!-- Harga -->
                  <div v-else-if="col.name === 'harga'">
                    <div class="text-subtitle2 text-primary text-bold">{{ formatCurrency(props.row.harga) }}</div>
                  </div>

                  <!-- Action -->
                  <div v-else-if="col.name === 'action'">
                    <q-btn color="blue" field="edit" icon="edit" class="q-ma-xs" @click="editJenisLayanan(props.row)" dense round>
                      <q-dialog v-model="editJenisLayananDialog" persistent>
                        <EditJenisLayanan @edited="jenisLayananEdited(props.row)" :jenisLayanan="jenisLayananData" />
                      </q-dialog>
                    </q-btn>
                    <q-btn color="red" field="delete" icon="delete" class="q-ma-xs" @click="deleteJenisLayananDialog(props.row)" dense round />
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
import { useJenisLayananStore } from 'src/stores/jenislayanan-store'
import CreateJenisLayanan from './CreateJenisLayanan.vue'
import EditJenisLayanan from './EditJenisLayanan.vue'

const $q = useQuasar()
const router = useRouter()
const jenisLayananStore = useJenisLayananStore()

// Get JenisLayanan
const jenisLayanans = ref([])
const getJenisLayanan = async () => {
  try {
    const res = await jenisLayananStore.all()
    jenisLayanans.value = res.data.data

    if (res.data.response === 'Failed') {
      router.push('/notfound')
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}
onMounted(() => {
  getJenisLayanan()
})

// Create JenisLayanan
const addJenisLayananDialog = ref(false)
const jenisLayananCreateed = () => {
  addJenisLayananDialog.value = false
  getJenisLayanan()
}

// Edit JenisLayanan
const editJenisLayananDialog = ref(false)
const jenisLayananData = ref('')
const editJenisLayanan = (row) => {
  editJenisLayananDialog.value = true
  jenisLayananData.value = row
}
const jenisLayananEdited = () => {
  editJenisLayananDialog.value = false
  getJenisLayanan()
}

// Delete JenisLayanan
const deleteJenisLayananDialog = (row) => {
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
    deleteJenisLayanan(row)
  })
}
const deleteJenisLayanan = async (row) => {
  try {
    const res = await jenisLayananStore.delete(row.id)

    if (res.data.status === 'Success') {
      $q.notify({
        color: 'positive',
        message: res.data.message
      })
      getJenisLayanan()
    }
  } catch (error) {
    console.error('Error fetching data:', error)
    $q.notify({
      color: 'negative',
      message: 'Terjadi kesalahan saat menghapus item'
    })
  }
}

// Table
const currencyData = jenisLayanans
const currencyColumns = [
  {
    name: 'id',
    field: 'id',
    label: 'No',
    align: 'center',
    headerStyle: 'font-weight: bolder; font-size: 13px;'
  },
  {
    name: 'jenis_cuci',
    field: 'jenis_cuci',
    label: 'Jenis Cuci',
    align: 'left',
    sortable: true,
    headerStyle: 'font-weight: bolder; font-size: 13px;'
  },
  {
    name: 'waktu',
    field: 'waktu',
    label: 'Waktu',
    align: 'center',
    sortable: true,
    headerStyle: 'font-weight: bolder; font-size: 13px;'
  },
  {
    name: 'harga',
    field: 'harga',
    label: 'Tambahan Harga',
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

// Format Currency
const formatCurrency = (amount) => {
  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR'
  })
  return formatter.format(amount)
}
</script>
