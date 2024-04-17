<template>
  <q-page class="q-pa-sm">
    <!-- Card -->
    <q-card class="bg-transparent no-shadow no-border" bordered>
      <q-card-section class="q-pa-none">
        <div class="row q-col-gutter-sm">
          <div v-if="loading">
            <q-skeleton width="1500px" height="75px" />
          </div>
          <div v-else v-for="(item, index) in items" :key="index" class="col-md-3 col-sm-12 col-xs-12">
            <q-item :style="`background-color: ${item.color1}`" class="q-pa-none">
              <q-item-section class="q-pa-md q-ml-none text-white">
                <q-item-label class="text-white text-h6 text-weight-bolder">{{ item.value }}</q-item-label>
                <q-item-label>{{ item.title }}</q-item-label>
              </q-item-section>
            </q-item>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Statistik Penjualan Produk -->
    <q-card class="q-mt-sm no-shadow" bordered>
      <q-card-section class="text-h6 q-pb-none">
        <q-item>
          <q-item-section avatar class="">
            <q-icon color="blue" name="stacked_line_chart" size="44px" />
          </q-item-section>

          <q-item-section>
            <div class="text-h6">Statistik Penjualan Produk</div>
          </q-item-section>
        </q-item>
      </q-card-section>

      <q-card-section v-if="chartLoading" class="row">
        <div class="col-12">
          <q-skeleton width="100%" height="300px" />
        </div>
      </q-card-section>
      <q-card-section v-else class="row">
        <div class="col-12">
          <!-- Grafik -->
          <ECharts :option="sales_options" class="q-mt-md" :resizable="true" autoresize style="height: 250px" />
        </div>
      </q-card-section>
    </q-card>

    <!-- Penjualan Terbaru -->
    <q-card class="q-mt-sm no-shadow" bordered>
      <q-card-section class="text-h6 q-pb-none">
        <q-item>
          <q-item-section avatar class="">
            <q-icon color="blue" name="shopping_cart" size="44px" />
          </q-item-section>

          <q-item-section>
            <q-item-label>
              <div class="text-h6">Penjualan Terbaru</div>
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-card-section>
      <q-card-section class="q-pa-none q-ma-none">
        <IndexNota />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed, watchEffect } from 'vue'
import * as echarts from 'echarts'
import ECharts from 'vue-echarts'
import { useNotaStore } from 'src/stores/nota-store'
import { useUserStore } from 'src/stores/user-store'
import { useKiloanStore } from 'src/stores/kiloan-store'
import { useBarangStore } from 'src/stores/barang-store'
import IndexNota from '/src/pages/dashboard/nota/IndexNota.vue'

// Nota
const notaStore = useNotaStore()
const notas = ref([])
const loading = ref(true)
const getNota = async () => {
  try {
    const res = await notaStore.all()
    notas.value = res.data.data
    loading.value = false
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

// Chart
const chart = ref({})
const chartLoading = ref(true)
const getChart = async () => {
  try {
    const res = await notaStore.chart()
    chart.value = res.data.data
    chartLoading.value = false
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

// User
const userStore = useUserStore()
const users = ref([])
const getUser = async () => {
  try {
    const res = await userStore.all()
    users.value = res.data.data
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

// Kiloan
const kiloanStore = useKiloanStore()
const kiloans = ref([])
const getKiloan = async () => {
  try {
    const res = await kiloanStore.all()
    kiloans.value = res.data.data
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

// Barang
const barangStore = useBarangStore()
const barangs = ref([])
const getBarang = async () => {
  try {
    const res = await barangStore.all()
    barangs.value = res.data.data
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

onMounted(() => {
  getNota()
  getChart()
  getUser()
  getKiloan()
  getBarang()
})

// Card
const items = ref([
  {
    title: 'Total Pendapatan',
    icon: 'fas fa-dollar-sign',
    value: Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(chart.value.total),
    color1: '#546bfa',
    color2: '#3e51b5'
  },
  {
    title: 'Total Penjualan',
    icon: 'fas fa-chart-bar',
    value: notas.value.length,
    color1: '#3a9688',
    color2: '#3e51b5'
  },
  {
    title: 'Total Users',
    icon: 'person',
    value: users.value.length,
    color1: '#7cb342',
    color2: '#3e51b5'
  },
  {
    title: 'Total Paket',
    icon: kiloans.value.length,
    value: '82',
    color1: '#f88c2b',
    color2: '#3e51b5'
  }
])
watchEffect(() => {
  items.value[0].value = Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(chart.value.total)
  items.value[1].value = notas.value.length
  items.value[2].value = users.value.length
  items.value[3].value = kiloans.value.length
})

// Grafik
let sales_options = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  grid: {
    left: '2%',
    right: '2%',
    top: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: [
    {
      type: 'category',
      data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    }
  ],
  yAxis: [
    {
      type: 'value',
      splitLine: {
        show: false
      }
    }
  ],
  series: [
    {
      name: 'Total Pendapatan',
      type: 'bar',
      data: [
        chart.value.Jan,
        chart.value.Feb,
        chart.value.Mar,
        chart.value.Apr,
        chart.value.May,
        chart.value.Jun,
        chart.value.Jul,
        chart.value.Aug,
        chart.value.Sep,
        chart.value.Oct,
        chart.value.Nov,
        chart.value.Dec
      ],
      color: '#546bfa'
    }
  ]
}
watchEffect(() => {
  sales_options.series[0].data = [
    chart.value.Jan,
    chart.value.Feb,
    chart.value.Mar,
    chart.value.Apr,
    chart.value.May,
    chart.value.Jun,
    chart.value.Jul,
    chart.value.Aug,
    chart.value.Sep,
    chart.value.Oct,
    chart.value.Nov,
    chart.value.Dec
  ]
})
</script>

<style scoped></style>
