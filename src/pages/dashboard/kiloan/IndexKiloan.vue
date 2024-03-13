<template>
  <q-page class="q-pa-sm">
    <q-table
      flat
      bordered
      class="statement-table"
      title="Kiloan"
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

      <!-- Add Kiloan -->
      <template v-slot:top-left>
        <div class="text-h5 q-pr-lg">Kiloan</div>
        <q-btn dense @click="addKiloanDialog = true" color="black" icon="add" class="shadow-3"><q-tooltip>Add Kiloan</q-tooltip></q-btn>
        <q-dialog v-model="addKiloanDialog" persistent>
          <CreateKiloan @added="kiloanAdded" />
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
          <q-btn dense round color="blue" field="edit" icon="edit" class="q-mx-xs" @click="editKiloan(props.row)">
            <q-dialog v-model="editKiloanDialog" persistent>
              <EditKiloan @edited="kiloanEdited(props.row)" :kiloan="kiloanData" />
            </q-dialog>
          </q-btn>
          <q-btn dense round color="red" field="delete" icon="delete" class="q-mx-xs" @click="deleteKiloanDialog(props.row)" />
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
                    <q-btn dense round color="blue" field="edit" icon="edit" class="q-mx-xs" @click="editKiloan(props.row)">
                      <q-dialog v-model="editKiloanDialog" persistent>
                        <EditKiloan @edited="kiloanEdited(props.row)" :kiloan="kiloanData" />
                      </q-dialog>
                    </q-btn>
                    <q-btn dense round color="red" field="delete" icon="delete" class="q-mx-xs" @click="deleteKiloanDialog(props.row)" />
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
import { useKiloanStore } from 'src/stores/kiloan-store'
import CreateKiloan from './CreateKiloan.vue'
import EditKiloan from './EditKiloan.vue'

const $q = useQuasar()
const router = useRouter()
const kiloanStore = useKiloanStore()

const kiloans = ref([])
const getKiloan = async () => {
  try {
    const res = await kiloanStore.all()
    kiloans.value = res.data.data

    if (res.data.response === 'Failed') {
      router.push('/notfound')
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}
onMounted(() => {
  getKiloan()
})

// Create Kiloan
const addKiloanDialog = ref(false)
const kiloanAdded = () => {
  addKiloanDialog.value = false
  getKiloan()
}

// Edit Kiloan
const editKiloanDialog = ref(false)
const kiloanData = ref('')
const editKiloan = (row) => {
  editKiloanDialog.value = true
  kiloanData.value = row
}
const kiloanEdited = () => {
  editKiloanDialog.value = false
  getKiloan()
}

// Delete Kiloan
const deleteKiloanDialog = (row) => {
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
    deleteKiloan(row)
  })
}
const deleteKiloan = async (row) => {
  try {
    const res = await kiloanStore.delete(row.id)

    if (res.data.status === 'Success') {
      $q.notify({
        color: 'positive',
        message: res.data.message
      })
      getKiloan()
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
const currencyData = kiloans
const currencyColumns = [
  {
    name: 'id',
    field: 'id',
    label: 'ID'
  },
  {
    name: 'paket',
    field: 'paket',
    label: 'Nama Paket',
    align: 'left',
    sortable: true
  },
  {
    name: 'harga',
    field: 'harga',
    label: 'Harga Per KG',
    align: 'left',
    sortable: true
  },
  {
    name: 'description',
    field: 'description',
    label: 'Deskripsi',
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
