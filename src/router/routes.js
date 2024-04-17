const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', name: 'home', component: () => import('pages/IndexPage.vue') }]
  },
  {
    path: '/auth',
    component: () => import('layouts/AuthLayout.vue'),
    meta: { requiresAuth: false },
    children: [{ path: '', name: 'auth', component: () => import('pages/auth/AuthPage.vue') }]
  },
  {
    path: '/dashboard',
    component: () => import('layouts/DashboardLayout.vue'),
    meta: { requiresAuth: true, roles: ['Admin', 'Karyawan'] },
    children: [
      { path: 'home', name: 'dashboardhome', component: () => import('pages/dashboard/IndexDashboardPage.vue') },
      { path: 'user', name: 'dashboarduser', component: () => import('pages/dashboard/user/IndexUser.vue') },
      { path: 'karyawan', name: 'dashboardkaryawan', component: () => import('pages/dashboard/karyawan/IndexKaryawan.vue') },
      { path: 'barang', name: 'dashboardbarang', component: () => import('pages/dashboard/barang/IndexBarang.vue') },
      { path: 'kiloan', name: 'dashboardkiloan', component: () => import('pages/dashboard/kiloan/IndexKiloan.vue') },
      { path: 'jenislayanan', name: 'dashboardjenislayanan', component: () => import('pages/dashboard/jenislayanan/IndexJenisLayanan.vue') },
      { path: 'pelanggan', name: 'dashboardpelanggan', component: () => import('pages/dashboard/pelanggan/IndexPelanggan.vue') },
      {
        path: 'nota',
        children: [
          { path: '', name: 'dashboardnota', component: () => import('pages/dashboard/nota/IndexNota.vue') },
          { path: ':id', name: 'dashboardshownota', component: () => import('pages/dashboard/nota/ShowNota.vue') }
        ]
      }
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
