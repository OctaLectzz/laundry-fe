<template>
  <div v-if="loading" class="flex flex-center q-mt-xl q-pb-xl">
    <q-skeleton width="300px" height="450px" />
  </div>
  <div v-else class="note">
    <div class="header">
      <div class="text-h5 text-bold">Nota Pembelian</div>
      <div class="text-subtitle2">{{ nota.created_at }}</div>
      <div class="text-subtitle2">{{ nota.no_nota }}</div>
    </div>
    <div class="body">
      <div class="item">
        Nama Pelanggan
        <p>{{ nota.nama_pelanggan }}</p>
      </div>
      <div class="item">
        Jenis Pemesanan
        <p>{{ nota.jenis }}</p>
      </div>
      <div v-if="nota.jenis === 'Paket Kiloan'">
        <div class="item">
          Paket
          <p>{{ kiloan.paket }}</p>
        </div>
        <div class="item">
          Harga Paket
          <p>{{ formatCurrency(kiloan.harga) }}</p>
        </div>
        <div class="item">
          Berat
          <p>{{ nota.berat }} kg</p>
        </div>
        <div class="item">
          Jenis Layanan
          <p>{{ jenis_layanan.jenis_cuci }}</p>
        </div>
        <div class="item">
          Harga Layanan
          <p>{{ formatCurrency(jenis_layanan.harga) }}</p>
        </div>
      </div>
      <div v-if="nota.jenis === 'Barang Satuan'">
        <div class="item">
          Barang :
          <p class="text-white">.</p>
        </div>
        <div v-for="barang in nota.notabarangs" :key="barang.id" class="item">
          {{ barang.barang }} x {{ barang.jumlah_barang }}
          <p>{{ formatCurrency(barang.harga * barang.jumlah_barang) }}</p>
        </div>
      </div>
    </div>
    <div class="footer">
      <div class="row q-gutter-md justify-end">
        <div class="col-4">
          <div>Total Harga :</div>
          <div>Diskon :</div>
          <div>Jumlah :</div>
        </div>
        <div class="col-4">
          <div>{{ formatCurrency(nota.total_harga) }}</div>
          <div>{{ nota.diskon }}%</div>
          <div>{{ formatCurrency(nota.jumlah) }}</div>
        </div>
      </div>
    </div>
  </div>

  <div class="flex flex-center">
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
  if(route.params.id) {
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
