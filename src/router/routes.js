const routes = [
  {
    path: '/',
    component: () => import('/src/layouts/MainLayout.vue'),
    children: [{ path: '', name: 'home', component: () => import('/src/pages/IndexPage.vue') }]
  },
  {
    path: '/auth',
    component: () => import('/src/layouts/AuthLayout.vue'),
    meta: { requiresAuth: false },
    children: [{ path: '', name: 'auth', component: () => import('/src/pages/auth/AuthPage.vue') }]
  },
  {
    path: '/dashboard',
    component: () => import('/src/layouts/DashboardLayout.vue'),
    meta: { requiresAuth: true, roles: ['Admin', 'Karyawan'] },
    children: [
      { path: 'home', name: 'dashboard.home', component: () => import('/src/pages/dashboard/IndexDashboardPage.vue') },
      { path: 'user', name: 'dashboard.user', component: () => import('/src/pages/dashboard/user/IndexUser.vue') },
      { path: 'karyawan', name: 'dashboard.karyawan', component: () => import('/src/pages/dashboard/karyawan/IndexKaryawan.vue') },
      { path: 'barang', name: 'dashboard.barang', component: () => import('/src/pages/dashboard/barang/IndexBarang.vue') },
      { path: 'kiloan', name: 'dashboard.kiloan', component: () => import('/src/pages/dashboard/kiloan/IndexKiloan.vue') },
      { path: 'jenislayanan', name: 'dashboard.jenislayanan', component: () => import('/src/pages/dashboard/jenislayanan/IndexJenisLayanan.vue') },
      { path: 'pelanggan', name: 'dashboard.pelanggan', component: () => import('/src/pages/dashboard/pelanggan/IndexPelanggan.vue') },
      {
        path: 'nota',
        children: [
          { path: '', name: 'dashboard.nota', component: () => import('/src/pages/dashboard/nota/IndexNota.vue') },
          { path: ':id', name: 'dashboard.shownota', component: () => import('/src/pages/dashboard/nota/ShowNota.vue') }
        ]
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('/src/pages/ErrorNotFound.vue')
  }
]

export default routes
