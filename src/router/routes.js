const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', name: 'home', component: () => import('pages/IndexPage.vue') }]
  },
  {
    path: '/dashboard',
    component: () => import('layouts/DashboardLayout.vue'),
    children: [
      { path: 'home', name: 'dashboardhome', component: () => import('pages/dashboard/IndexDashboardPage.vue') },
      { path: 'karyawan', name: 'dashboardkaryawan', component: () => import('pages/dashboard/karyawan/IndexKaryawan.vue') },
      { path: 'barang', name: 'dashboardbarang', component: () => import('pages/dashboard/barang/IndexBarang.vue') },
      { path: 'jenislayanan', name: 'dashboardjenislayanan', component: () => import('pages/dashboard/jenislayanan/IndexJenisLayanan.vue') },
      { path: 'pelanggan', name: 'dashboardpelanggan', component: () => import('pages/dashboard/pelanggan/IndexPelanggan.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
