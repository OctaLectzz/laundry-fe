export default ({ router }) => {
  router.beforeEach((to, from, next) => {
    // Periksa apakah halaman memerlukan otentikasi
    if (to.meta.requiresAuth) {
      const userRole = localStorage.getItem('role')

      // Periksa apakah pengguna memiliki peran yang diperlukan untuk mengakses halaman
      if (userRole && to.meta.roles.includes(userRole)) {
        // Jika memiliki peran yang sesuai, lanjutkan navigasi
        next()
      } else {
        // Jika tidak memiliki peran yang sesuai, redirect ke halaman lain atau tampilkan pesan kesalahan
        if (to.path !== '/home') {
          next('/home')
        } else {
          // Avoid redirection loop, if already on "/home", just let it pass
          next()
        }
      }
    } else {
      // Jika halaman tidak memerlukan otentikasi, lanjutkan navigasi
      next()
    }
  })
}
