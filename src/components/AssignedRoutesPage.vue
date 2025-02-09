<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Assigned Routes</h1>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error" class="text-red-500">{{ error }}</div>
    <ul v-else class="bg-white shadow rounded-lg p-4">
      <li v-for="route in assignedRoutes" :key="route.id" class="border-b py-2">
        <div class="font-semibold">{{ route.name }}</div>
        <div>{{ route.description }}</div>
        <div><strong>Address:</strong> {{ route.address }}</div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const assignedRoutes = ref([]);
const loading = ref(true);
const error = ref(null);

const fetchRoutes = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/complaints/routes');
    assignedRoutes.value = response.data;
  } catch (err) {
    error.value = 'Failed to load routes';
  } finally {
    loading.value = false;
  }
};

onMounted(fetchRoutes);
</script>

<style scoped>
ul li:last-child {
  border-bottom: none;
}
</style>
