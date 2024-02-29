<template>
  <q-page class="q-pa-sm">
    <q-table
      flat
      bordered
      class="statement-table"
      title="User"
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

      <!-- Add User -->
      <template v-slot:top-left>
        <div class="text-h5 q-pr-lg">User</div>
        <q-btn dense @click="addUserDialog = true" color="black" icon="add" class="shadow-3"><q-tooltip>Add User</q-tooltip></q-btn>
        <q-dialog v-model="addUserDialog" full-width full-height persistent transition-show="slide-up" transition-hide="slide-down">
          <CreateUser @added="userAdded" />
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
          <q-btn dense round color="blue" field="edit" icon="edit" class="q-mx-xs" @click="editUser(props.row)">
            <q-dialog v-model="editUserDialog" full-width full-height persistent transition-show="slide-up" transition-hide="slide-down">
              <EditUser @edited="userEdited(props.row)" :user="userData" />
            </q-dialog>
          </q-btn>
          <q-btn dense round color="red" field="delete" icon="delete" class="q-mx-xs" @click="deleteUserDialog(props.row)" />
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
                    <q-btn dense round color="blue" field="edit" icon="edit" class="q-mx-xs" @click="editUser(props.row)">
                      <q-dialog v-model="editUserDialog" full-width full-height persistent transition-show="slide-up" transition-hide="slide-down">
                        <EditUser @edited="userEdited(props.row)" :user="userData" />
                      </q-dialog>
                    </q-btn>
                    <q-btn dense round color="red" field="delete" icon="delete" class="q-mx-xs" @click="deleteUserDialog(props.row)" />
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
import { useUserStore } from 'src/stores/user-store'
import CreateUser from './CreateUser.vue'
import EditUser from './EditUser.vue'

const $q = useQuasar()
const router = useRouter()
const userStore = useUserStore()

const users = ref([])
const getUser = async () => {
  try {
    const res = await userStore.all()
    users.value = res.data.data

    if (res.data.response === 'Failed') {
      router.push('/notfound')
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}
onMounted(() => {
  getUser()
})

// Create User
const addUserDialog = ref(false)
const userAdded = () => {
  addUserDialog.value = false
  getUser()
}

// Edit User
const editUserDialog = ref(false)
const userData = ref('')
const editUser = (row) => {
  editUserDialog.value = true
  userData.value = row
}
const userEdited = () => {
  editUserDialog.value = false
  getUser()
}

// Delete User
const deleteUserDialog = (row) => {
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
    deleteUser(row)
  })
}
const deleteUser = async (row) => {
  try {
    const res = await userStore.delete(row.id)

    if (res.data.status === 'Success') {
      $q.notify({
        color: 'positive',
        message: res.data.message
      })
      getUser()
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
const currencyData = users
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
    name: 'role',
    field: 'role',
    label: 'Role',
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
