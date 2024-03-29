export default ({ router }) => {
  router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token')

    // Cek apakah route memerlukan autentikasi
    if (to.meta.requiresAuth) {
      if (!token) {
        // Redirect ke halaman login jika tidak ada token
        next('/auth')
      } else {
        // Lanjutkan navigasi jika token ada
        next()
      }
    } else if (to.name === 'auth' && token) {
      // Jika pengguna sudah memiliki token, redirect dari halaman login
      next({ name: 'home' })
    } else {
      // Jika route tidak memerlukan autentikasi, lanjutkan navigasi
      next()
    }
  })
}