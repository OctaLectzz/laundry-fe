<template>
  <q-page class="q-pa-sm">
    <q-table
      flat
      bordered
      class="statement-table"
      title="Karyawan"
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

      <!-- Add Karyawan -->
      <template v-slot:top-left>
        <div class="text-h5 q-pr-lg">Karyawan</div>
        <q-btn dense @click="addKaryawanDialog = true" color="black" icon="add" class="shadow-3"><q-tooltip>Add Karyawan</q-tooltip></q-btn>
        <q-dialog v-model="addKaryawanDialog" full-width full-height persistent transition-show="slide-up" transition-hide="slide-down">
          <CreateKaryawan @added="karyawanAdded" />
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

      <!-- User -->
      <template #body-cell-user="props">
        <q-td :props="props">
          <div text-color="white" dense square>
            <div class="text-bold">{{ props.row.name }}</div>
            <div>{{ props.row.email }}</div>
          </div>
        </q-td>
      </template>

      <!-- Action -->
      <template #body-cell-action="props">
        <q-td :props="props">
          <q-btn dense round color="blue" field="edit" icon="edit" class="q-mx-xs" @click="editKaryawan(props.row)">
            <q-dialog v-model="editKaryawanDialog" full-width full-height persistent transition-show="slide-up" transition-hide="slide-down">
              <EditKaryawan @edited="karyawanEdited(props.row)" :karyawan="karyawanData" />
            </q-dialog>
          </q-btn>
          <q-btn dense round color="red" field="delete" icon="delete" class="q-mx-xs" @click="deleteKaryawanDialog(props.row)" />
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

                  <!-- User -->
                  <div v-else-if="col.name === 'user'" text-color="white" dense square>
                    <div class="text-bold">{{ props.row.name }}</div>
                    <div>{{ props.row.email }}</div>
                  </div>

                  <!-- Action -->
                  <div v-else-if="col.name === 'action'">
                    <q-btn dense round color="blue" field="edit" icon="edit" class="q-mx-xs" @click="editKaryawan(props.row)">
                      <q-dialog v-model="editKaryawanDialog" full-width full-height persistent transition-show="slide-up" transition-hide="slide-down">
                        <EditKaryawan @edited="karyawanEdited(props.row)" :karyawan="karyawanData" />
                      </q-dialog>
                    </q-btn>
                    <q-btn dense round color="red" field="delete" icon="delete" class="q-mx-xs" @click="deleteKaryawanDialog(props.row)" />
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
import { useKaryawanStore } from 'src/stores/karyawan-store'
import CreateKaryawan from './CreateKaryawan.vue'
import EditKaryawan from './EditKaryawan.vue'

const $q = useQuasar()
const router = useRouter()
const karyawanStore = useKaryawanStore()

const karyawans = ref([])
const getKaryawan = async () => {
  try {
    const res = await karyawanStore.all()
    karyawans.value = res.data.data

    if (res.data.response === 'Failed') {
      router.push('/notfound')
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}
onMounted(() => {
  getKaryawan()
})

// Create Karyawan
const addKaryawanDialog = ref(false)
const karyawanAdded = () => {
  addKaryawanDialog.value = false
  getKaryawan()
}

// Edit Karyawan
const editKaryawanDialog = ref(false)
const karyawanData = ref('')
const editKaryawan = (row) => {
  editKaryawanDialog.value = true
  karyawanData.value = row
}
const karyawanEdited = () => {
  editKaryawanDialog.value = false
  getKaryawan()
}

// Delete Karyawan
const deleteKaryawanDialog = (row) => {
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
    deleteKaryawan(row)
  })
}
const deleteKaryawan = async (row) => {
  try {
    const res = await karyawanStore.delete(row.id)

    if (res.data.status === 'Success') {
      $q.notify({
        color: 'positive',
        message: res.data.message
      })
      getKaryawan()
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
const currencyData = karyawans
const currencyColumns = [
  {
    name: 'id',
    field: 'id',
    label: 'ID'
  },
  {
    name: 'user',
    field: 'name',
    label: 'User',
    align: 'left',
    sortable: true
  },
  {
    name: 'jenis_kelamin',
    field: 'jenis_kelamin',
    label: 'Jenis Kelamin',
    align: 'left',
    sortable: true
  },
  {
    name: 'alamat',
    field: 'alamat',
    label: 'Alamat',
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
</script>
