<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Assigned Routes</h1>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error" class="text-red-500">{{ error }}</div>
    <div v-else>
      <ul v-if="assignedRoutes.length" class="bg-white shadow rounded-lg p-4">
        <li 
          v-for="route in assignedRoutes" 
          :key="route.id" 
          class="border-b py-2 cursor-pointer hover:bg-gray-100 p-2 rounded"
          @click="openDialog(route)"
        >
          <div class="font-semibold">{{ route.name }}</div>
          <div>{{ route.description }}</div>
          <div><strong>Address:</strong> {{ route.address }}</div>
        </li>
      </ul>
      <p v-else class="text-gray-500 text-center">No assigned complaints</p>
    </div>

    <div v-if="dialogOpen" class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div class="bg-white p-6 rounded shadow-lg w-96">
        <h2 class="text-xl font-bold mb-2">Resolve Complaint</h2>
        <div class="flex justify-end gap-2 mt-4">
          <button @click="closeDialog" class="px-4 py-2 bg-gray-300 rounded">Cancel</button>
          <button @click="submitResolution" class="px-4 py-2 bg-blue-600 text-white rounded">Resolved</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const assignedRoutes = ref([]);
const loading = ref(true);
const error = ref(null);
const dialogOpen = ref(false);
const selectedRoute = ref(null);

const fetchRoutes = async () => {
  loading.value = true;
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/complaints/routes');
    assignedRoutes.value = response.data;
  } catch (err) {
    error.value = 'Failed to load routes';
  } finally {
    loading.value = false;
  }
};

const openDialog = (route) => {
  selectedRoute.value = route;
  dialogOpen.value = true;
};

const closeDialog = () => {
  dialogOpen.value = false;
};

const submitResolution = async () => {
  try {
    await axios.post('http://127.0.0.1:8000/api/complaints/resolve', {
      routeId: selectedRoute.value.id
    });
   
    alert('Resolution submitted successfully');
    closeDialog();
    fetchRoutes(); // Reload the routesp
  } catch (err) {
    alert('Failed to submit resolution');
  }
};

onMounted(fetchRoutes);
</script>

<style scoped>
ul li:last-child {
  border-bottom: none;
}
</style>
