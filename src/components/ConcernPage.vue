<template>
  <div class="space-y-8">
    <div class="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 class="text-xl font-semibold text-gray-800">Concerns</h2>

      <!-- Search Box -->
      <div class="mb-4">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search concerns..."
          class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <!-- List of Concerns -->
      <div class="space-y-4">
        <div
          v-for="concern in filteredConcerns"
          :key="concern.id"
          @click="openModal(concern)"
          class="p-4 bg-gray-100 rounded-lg shadow-sm cursor-pointer hover:bg-gray-200"
        >
          <h3 class="text-lg font-medium text-gray-800">{{ concern.title }}</h3>
          <p class="text-sm text-gray-600">Submitted by: {{ concern.submittedBy }}</p>
          <p class="text-sm text-gray-600">Date: {{ concern.date }}</p>
        </div>
      </div>
    </div>

    <!-- Concern Details Modal -->
    <Dialog
      v-if="selectedConcern"
      header="Concern Details"
      v-model:visible="showModal"
      modal
      class="concern-modal"
      style="width: 40vw; max-width: 600px;"
    >
      <div>
        <h3 class="text-lg font-semibold text-gray-800">{{ selectedConcern.title }}</h3>
        <p class="mt-2 text-gray-700">{{ selectedConcern.description }}</p>

        <!-- Attached Image -->
        <div v-if="selectedConcern.image" class="mt-4">
          <p class="text-sm font-medium text-gray-700">Attached Image:</p>
          <img :src="selectedConcern.image" alt="Concern Image" class="w-full h-auto mt-2 rounded-lg" />
        </div>

        <!-- Additional Info -->
        <div class="mt-4">
          <p class="text-sm text-gray-600"><strong>Submitted by:</strong> {{ selectedConcern.submittedBy }}</p>
          <p class="text-sm text-gray-600"><strong>Date:</strong> {{ selectedConcern.date }}</p>
          <p class="text-sm text-gray-600"><strong>Address:</strong> {{ selectedConcern.address }}</p>
        </div>
      </div>

      <div class="mt-6 flex justify-end space-x-4">
        <button
          class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          @click="verifyConcern"
        >
          Verify
        </button>
        <button
          class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          @click="rejectConcern"
        >
          Reject
        </button>
      </div>
    </Dialog>
  </div>
</template>
<script>

export default {
  name: 'ConcernPage',
  data() {
    return {
      searchQuery: '',
      showModal: false,
      selectedConcern: null,
      concerns: [
        {
          id: 1,
          title: 'Garbage Pickup Delay',
          description: 'The garbage pickup in my area has been delayed for three days.',
          submittedBy: 'John Doe',
          date: '2024-12-30',
          address: 'San Julian',
          image: 'https://via.placeholder.com/600x400', // Example image URL
        },
        {
          id: 2,
          title: 'Missed Collection',
          description: 'No garbage collection occurred on the scheduled day.',
          submittedBy: 'Jane Smith',
          date: '2024-12-29',
          address: 'San Julian',
          image: '', // No image for this concern
        },
        {
          id: 3,
          title: 'Damaged Garbage Truck',
          description: 'A garbage truck broke down in our neighborhood, causing delays.',
          submittedBy: 'Alex Johnson',
          date: '2024-12-28',
          address: 'San Julian',
          image: 'https://via.placeholder.com/600x400', // Example image URL
        },
      ],
    };
  },
  computed: {
    filteredConcerns() {
      if (!this.searchQuery) return this.concerns;
      const query = this.searchQuery.toLowerCase();
      return this.concerns.filter((concern) =>
        concern.title.toLowerCase().includes(query)
      );
    },
  },
  methods: {
    openModal(concern) {
      this.selectedConcern = concern;
      this.showModal = true;
    },
    verifyConcern() {
      alert(`Concern "${this.selectedConcern.title}" has been verified.`);
      this.showModal = false;
    },
    rejectConcern() {
      alert(`Concern "${this.selectedConcern.title}" has been rejected.`);
      this.showModal = false;
    },
  },
};
</script>

<style scoped>
/* Dialog modal customization */
.concern-modal .p-dialog-content {
  font-size: 0.875rem;
}
</style>
