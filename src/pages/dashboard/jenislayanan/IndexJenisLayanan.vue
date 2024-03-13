<template>
  <q-page class="q-pa-sm">
    <q-table
      flat
      bordered
      class="statement-table"
      title="Jenis Layanan"
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

      <!-- Add Jenis Layanan -->
      <template v-slot:top-left>
        <div class="text-h5 q-pr-lg">Jenis Layanan</div>
        <q-btn dense @click="addJenisLayananDialog = true" color="black" icon="add" class="shadow-3"><q-tooltip>Add JenisLayanan</q-tooltip></q-btn>
        <q-dialog v-model="addJenisLayananDialog" persistent>
          <CreateJenisLayanan @added="jenisLayananAdded" />
        </q-dialog>
      </template>

      <!-- Table -->
      <!-- ID -->
      <template #body-cell-id="props">
        <q-td :props="props">
          <div text-color="white" dense square>{{ props.rowIndex + 1 }}</div>
        </q-td>
      </template>

      <!-- Harga -->
      <template #body-cell-harga="props">
        <q-td :props="props">
          <div text-color="white" dense square>{{ formatCurrency(props.row.harga) }}</div>
        </q-td>
      </template>

      <!-- Action -->
      <template #body-cell-action="props">
        <q-td :props="props">
          <q-btn dense round color="blue" field="edit" icon="edit" class="q-mx-xs" @click="editJenisLayanan(props.row)">
            <q-dialog v-model="editJenisLayananDialog" persistent>
              <EditJenisLayanan @edited="jenisLayananEdited(props.row)" :jenisLayanan="jenisLayananData" />
            </q-dialog>
          </q-btn>
          <q-btn dense round color="red" field="delete" icon="delete" class="q-mx-xs" @click="deleteJenisLayananDialog(props.row)" />
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
                  <div v-if="col.name === 'id'" text-color="white" dense square>
                    {{ props.rowIndex + 1 }}
                  </div>

                  <!-- Harga -->
                  <div v-else-if="col.name === 'harga'" text-color="white" dense square>{{ formatCurrency(props.row.harga) }}</div>

                  <!-- Action -->
                  <div v-else-if="col.name === 'action'">
                    <q-btn dense round color="blue" field="edit" icon="edit" class="q-mx-xs" @click="editJenisLayanan(props.row)">
                      <q-dialog v-model="editJenisLayananDialog" persistent>
                        <EditJenisLayanan @edited="jenisLayananEdited(props.row)" :jenisLayanan="jenisLayananData" />
                      </q-dialog>
                    </q-btn>
                    <q-btn dense round color="red" field="delete" icon="delete" class="q-mx-xs" @click="deleteJenisLayananDialog(props.row)" />
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
import { useJenisLayananStore } from 'src/stores/jenislayanan-store'
import CreateJenisLayanan from './CreateJenisLayanan.vue'
import EditJenisLayanan from './EditJenisLayanan.vue'

const $q = useQuasar()
const router = useRouter()
const jenisLayananStore = useJenisLayananStore()

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
const jenisLayananAdded = () => {
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
    label: 'ID'
  },
  {
    name: 'jenis_cuci',
    field: 'jenis_cuci',
    label: 'Jenis Cuci',
    align: 'left',
    sortable: true
  },
  {
    name: 'waktu',
    field: 'waktu',
    label: 'Waktu',
    align: 'left',
    sortable: true
  },
  {
    name: 'harga',
    field: 'harga',
    label: 'Tambahan Harga',
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

// Format Currency
const formatCurrency = (amount) => {
  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR'
  })
  return formatter.format(amount)
}
</script>
