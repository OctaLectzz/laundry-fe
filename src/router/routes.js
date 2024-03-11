const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', name: 'home', component: () => import('pages/IndexPage.vue') }]
  },
  {
    path: '/auth',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      { path: 'login', name: 'login', component: () => import('pages/auth/LoginPage.vue') },
      { path: 'register', name: 'register', component: () => import('pages/auth/RegisterPage.vue') }
    ]
  },
  {
    path: '/dashboard',
    component: () => import('layouts/DashboardLayout.vue'),
    children: [
      { path: 'home', name: 'dashboardhome', component: () => import('pages/dashboard/IndexDashboardPage.vue') },
      { path: 'user', name: 'dashboarduser', component: () => import('pages/dashboard/user/IndexUser.vue') },
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
