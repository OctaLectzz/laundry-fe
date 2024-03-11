<template>
  <div id="q-app">
    <q-layout view="lHh Lpr fff" class="high">
      <q-page-container>
        <router-view v-slot="{ Component }">
          <keep-alive>
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script setup></script>

<style>
::-webkit-scrollbar {
  display: none;
}
.high {
  max-width: 500px;
  margin: auto;
}
</style>
