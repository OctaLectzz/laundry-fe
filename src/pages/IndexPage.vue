<template>
  <head>
    <title>Landing Page Laundry</title>
    <link rel="stylesheet" href="src/css/styles.css" />
  </head>

  <body>
    <nav class="container">
      <span class="logo">Logo</span>
      <ul class="list-items">
        <li class="list-item">About Us</li>
        <li class="list-item">Services</li>
        <li class="list-item">Harga</li>
        <li class="list-item">Login</li>
        <li class="list-item">Register</li>
        <li>
          <span class="phone-svg"></span>
          Call Us
          <br />
          9373105031
        </li>
      </ul>
    </nav>
    <main>
      <div class="hero-section">
        <h1>Laundry Camelia</h1>
        <button class="btn">Learn More</button>
      </div>
      
    </main>

  </body>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'IndexPage'
})
</script>
