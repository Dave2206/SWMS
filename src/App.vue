<template>
  <div id="app">
    <!-- Header Component -->
    <HeaderVue />

    <!-- Dynamic Page Content -->
    <div class="page-container">
      <router-view />
    </div>
  </div>
</template>

<script>
import HeaderVue from './components/Header.vue';

export default {
  name: "App",
  components: {
    HeaderVue,
  },
};
</script>

<style>
/* Ensure the header and content are styled appropriately */
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.page-container {
  flex: 1;
  padding: 20px;
}
</style>
