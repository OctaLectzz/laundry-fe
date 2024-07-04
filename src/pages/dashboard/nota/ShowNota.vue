<template>
  <div v-if="loading" class="flex flex-center q-mt-xl q-pb-xl">
    <q-skeleton width="300px" height="450px" />
  </div>

  <div v-else class="note">
    <div class="header">
      <div class="text-h5 text-bold">Nota Pembelian</div>
      <div class="text-subtitle2 text-grey-8">{{ nota.created_at }}</div>
      <div class="text-subtitle2 text-grey-7">{{ nota.no_nota }}</div>
    </div>

    <div class="body text-caption">
      <table class="full-width">
        <tr height="30px">
          <td>Nama Pelanggan</td>
          <td>:</td>
          <td class="text-right">{{ nota.nama_pelanggan }}</td>
        </tr>

        <tr height="30px">
          <td>Jenis Pemesanan</td>
          <td>:</td>
          <td class="text-right">{{ nota.jenis }}</td>
        </tr>

        <tbody v-if="nota.jenis === 'Paket Kiloan'">
          <tr height="30px">
            <td>Paket</td>
            <td>:</td>
            <td class="text-right">{{ kiloan.paket }}</td>
          </tr>

          <tr height="30px">
            <td>Harga Paket</td>
            <td>:</td>
            <td class="text-right">{{ formatCurrency(kiloan.harga) }}</td>
          </tr>

          <tr height="30px">
            <td>Berat</td>
            <td>:</td>
            <td class="text-right">{{ nota.berat }} kg</td>
          </tr>
        </tbody>

        <tbody v-if="nota.jenis === 'Barang Satuan'">
          <tr height="30px">
            <td>Jenis Layanan</td>
            <td>:</td>
            <td class="text-right">{{ jenis_layanan.jenis_cuci }}</td>
          </tr>

          <tr height="30px">
            <td>Harga Layanan</td>
            <td>:</td>
            <td class="text-right">{{ formatCurrency(jenis_layanan.harga) }}</td>
          </tr>

          <tr height="30px">
            <td>Barang :</td>
          </tr>

          <tr height="30px" v-for="barang in nota.notabarangs" :key="barang.id">
            <td>{{ barang.barang }}</td>
            <td>*{{ barang.jumlah_barang }}</td>
            <td class="text-right">{{ formatCurrency(barang.harga * barang.jumlah_barang) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="footer">
      <div class="row q-gutter-md justify-end">
        <div class="col-4">
          <div class="q-my-sm">Total Harga :</div>
          <div class="q-my-sm">Diskon :</div>
          <div class="q-my-sm">Jumlah :</div>
        </div>
        <div class="col-4">
          <div class="text-primary text-bold q-my-sm">{{ formatCurrency(nota.total_harga) }}</div>
          <div class="text-red text-bold q-my-sm">{{ nota.diskon }}%</div>
          <div class="text-primary text-bold q-my-sm">{{ formatCurrency(nota.jumlah) }}</div>
        </div>
      </div>
    </div>
  </div>

  <div class="flex flex-center q-pb-xl">
    <q-btn color="red" label="Print Nota" @click="printNota" />
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { useNotaStore } from 'src/stores/nota-store'

const route = useRoute()
const notaStore = useNotaStore()
const loading = ref(true)

// Get Nota
const nota = ref({})
const kiloan = ref({})
const jenis_layanan = ref({})
const getNota = async (id) => {
  loading.value = true
  try {
    const res = await notaStore.show(id)
    nota.value = res.data.data
    kiloan.value = res.data.data.kiloan
    jenis_layanan.value = res.data.data.jenis_layanan
  } catch (error) {
    console.error('Error fetching data:', error)
  }
  loading.value = false
}
watchEffect(() => {
  if (route.params.id) {
    getNota(route.params.id)
  }
})

// Format Rupiah
const formatCurrency = (amount) => {
  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR'
  })
  return formatter.format(amount)
}

// print Nota
const printNota = () => {
  const noteElement = document.querySelector('.note')
  const printWindow = window.open('', '_blank')
  printWindow.document.write('<html><head><title>Nota Pembelian</title>')

  // Link to Quasar CSS
  printWindow.document.write('<link href="https://cdn.jsdelivr.net/npm/quasar@latest/dist/quasar.min.css" rel="stylesheet">')

  printWindow.document.write('<style>')
  printWindow.document.write(`
    body {
      max-width: 400px;
      margin: auto;
    }
    @page {
      size: 80mm 150mm; /* Set the paper size as per your requirement */
      margin: 0;
    }
    .note {
      border: 1px solid #ccc;
      border-radius: 5px;
      padding: 20px;
      width: 300px;
      margin: 100px auto 20px;
    }
    .header {
      text-align: center;
      margin-bottom: 20px;
      border-bottom: 1px solid #ccc;
    }
    .body {
      margin-bottom: 20px;
    }
    .item {
      display: flex;
      justify-content: space-between;
      margin-bottom: -10px;
    }
    .footer {
      text-align: right;
      border-top: 1px solid #ccc;
      padding-top: 10px;
    }
  `)
  printWindow.document.write('</style>')
  printWindow.document.write('</head><body>')
  printWindow.document.write(noteElement.innerHTML)
  printWindow.document.write('</body></html>')
  printWindow.document.close()
  printWindow.print()
}
</script>

<style scoped>
.note {
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 20px;
  width: 300px;
  margin: 100px auto 20px;
}

.header {
  text-align: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #ccc;
}

.body {
  margin-bottom: 20px;
}

.item {
  display: flex;
  justify-content: space-between;
  margin-bottom: -10px;
}

.footer {
  text-align: right;
  border-top: 1px solid #ccc;
  padding-top: 10px;
}
</style>
