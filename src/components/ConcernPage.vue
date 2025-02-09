<template>
  <div class="space-y-8">
    <div class="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 class="text-xl font-semibold text-gray-800">Concerns Management</h2>

      <!-- Tabs for Different Stages -->
      <div class="flex space-x-4 mb-4">
        <button 
          v-if="authRole === 'Barangay Admin' || authRole === 'Barangay superadmin'"
          @click="activeTab = 'pending'" 
          :class="{ 'bg-green-500 text-white': activeTab === 'pending' }" 
          class="px-4 py-2 rounded-lg">
            Pending Verification
        </button>
        <button
          v-if="authRole === 'LGU Officer'"
          @click="activeTab = 'assigned'"
          :class="{ 'bg-blue-500 text-white': activeTab === 'assigned' }"
          class="px-4 py-2 rounded-lg"
        >
          Assign Concerns
      </button>
        <button @click="activeTab = 'all'" :class="{ 'bg-gray-500 text-white': activeTab === 'all' }" class="px-4 py-2 rounded-lg">All Concerns</button>
      </div>

      <!-- Search Box -->
      <div class="mb-4">
        <input type="text" v-model="searchQuery" placeholder="Search concerns..." class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
      </div>

      <!-- List of Concerns -->
      <div class="space-y-4">
        <div v-for="concern in filteredConcerns" :key="concern.id" @click="openModal(concern)" class="p-4 bg-gray-100 rounded-lg shadow-sm cursor-pointer hover:bg-gray-200">
          <h3 class="text-lg font-medium text-gray-800">{{ concern.title }}</h3>
          <p class="text-sm text-gray-600">Submitted by: {{ concern.submittedBy }}</p>
          <p class="text-sm text-gray-600">Date: {{ concern.date }}</p>
          <p v-if="concern.isVerified === 1" class="text-sm text-green-600">Verified</p>
          <p v-if="concern.isVerified === 9" class="text-sm text-red-600">Rejected</p>
        </div>
      </div>
    </div>

    <!-- Concern Details Modal -->
    <Dialog v-if="selectedConcern" header="Concern Details" v-model:visible="showModal" modal class="concern-modal" style="width: 40vw; max-width: 600px;">
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
        <button v-if="selectedConcern.isVerified === null" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700" @click="verifyConcern">Verify</button>
        <button v-if="selectedConcern.isVerified === null" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700" @click="rejectConcern">Reject</button>
        <button v-if="selectedConcern.isVerified === 1 && !selectedConcern.isAssigned" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" @click="openAssignmentDialog">Assign</button>
      </div>
    </Dialog>

    <!-- Assignment Dialog -->
    <Dialog v-if="showAssignmentDialog" header="Assign to Driver" v-model:visible="showAssignmentDialog" modal class="assign-dialog" style="width: 30vw; max-width: 500px;">
      <div>
        <label for="driverSelect" class="text-sm text-gray-700">Select Driver</label>
        <select v-model="selectedDriver" id="driverSelect" class="w-full p-2 mt-2 border border-gray-300 rounded-lg">
          <option v-for="driver in drivers" :key="driver.id" :value="driver.id">{{ driver.name }}</option>
        </select>
      </div>

      <div class="mt-4 flex justify-end space-x-4">
        <button class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700" @click="closeAssignmentDialog">Cancel</button>
        <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" @click="assignToDriver">Assign</button>
      </div>
    </Dialog>
  </div>
 <Toast ref="toast"></Toast>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ConcernPage',
  data() {
    return {
      searchQuery: '',
      showModal: false,
      showAssignmentDialog: false,
      selectedConcern: null,
      selectedDriver: null,
      concerns: [],
      drivers: [], // List of drivers
      activeTab: 'pending', // default to 'pending' tab
      authRole: null, // Store the role from localStorage
    };
  },
  computed: {
    filteredConcerns() {
      const filtered = this.concerns.filter(concern => {
        if (this.activeTab === 'pending') return concern.isVerified === null;
        if (this.activeTab === 'assigned') return concern.isAssigned === null;
        return true; // Show all concerns for the 'all' tab
      });
      return this.searchQuery ? filtered.filter(concern => concern.title.toLowerCase().includes(this.searchQuery.toLowerCase())) : filtered;
    },
  },
  methods: {
    // Fetch concerns based on active tab
    async fetchConcerns() {
      let url = 'http://127.0.0.1:8000/api/complaints';
      
      if (this.activeTab === 'pending') {
        url = 'http://127.0.0.1:8000/api/complaints/verification';
      } else if (this.activeTab === 'assigned') {
        url = 'http://127.0.0.1:8000/api/complaints/assignment';
      }

      try {
        const response = await axios.get(url);
        this.concerns = response.data.data.map((item) => ({
          id: item.id,
          title: item.subject,
          description: item.description,
          submittedBy: item.email,
          date: new Date(item.created_at).toLocaleDateString(),
          address: item.address,
          image: item.file_path || '',
          isVerified: item.is_verified,
          isAssigned: item.is_assigned,
          assignedTo: item.assigned_to,
          assignedDate: item.assigned_date,
        }));
      } catch (error) {
        console.error('Error fetching concerns:', error);
      }
    },
    openModal(concern) {
      this.selectedConcern = concern;
      this.showModal = true;
    },
    async verifyConcern() {
      try {
        await axios.put(`http://127.0.0.1:8000/api/complaints/${this.selectedConcern.id}`, { is_verified: 1 });
        this.$refs.toast.add({ severity: 'success', summary: 'Verified Successfully', detail:`Concern "${this.selectedConcern.title}" has been verified.`, life: 3000 });
        this.showModal = false;
        this.fetchConcerns();
      } catch (error) {
        console.error('Error verifying concern:', error);
        this.$refs.toast.add({ severity: 'error', summary: 'Verification failed', detail:error.response.data.message, life: 3000 });
      }
    },
    async rejectConcern() {
      try {
        await axios.put(`http://127.0.0.1:8000/api/complaints/${this.selectedConcern.id}`, { is_verified: 9 });
        this.$refs.toast.add({ severity: 'success', summary: 'Rejected Successfully', detail:`Concern "${this.selectedConcern.title}" has been rejected.`, life: 3000 });
        this.fetchConcerns();
      } catch (error) {
        console.error('Error rejecting concern:', error);
         this.$refs.toast.add({ severity: 'error', summary: 'Rejection failed', detail:error.response.data.message, life: 3000 });
      }
    },
    openAssignmentDialog() {
      this.fetchDrivers(); // Fetch list of drivers before showing the dialog
      this.showAssignmentDialog = true;
    },
    closeAssignmentDialog() {
      this.showAssignmentDialog = false;
    },
   async fetchDrivers() {
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/drivers'); // Adjust to the correct API endpoint
    console.log(response);

    // Directly access the 'drivers' array
    this.drivers = response.data.drivers;
  } catch (error) {
    console.error('Error fetching drivers:', error);
  }
}
,
    async assignToDriver() {
      try {
        await axios.put(`http://127.0.0.1:8000/api/complaints/${this.selectedConcern.id}/assign`, { is_assigned: 1, assigned_to: this.selectedDriver });
        this.$refs.toast.add({ severity: 'success', summary: 'Assigned Successfully', detail:`Concern "${this.selectedConcern.title}" has been assigned.`, life: 3000 });
        this.fetchConcerns();
        this.closeAssignmentDialog();
         this.showModal = false;
      } catch (error) {
        console.error('Error assigning concern to driver:', error);
        this.$refs.toast.add({ severity: 'error', summary: 'Assignment Failed', detail:error.response.data.message, life: 3000 });
      }
    },
  },
  watch: {
    activeTab() {
      this.fetchConcerns(); // Re-fetch concerns when tab changes
    },
  },
  mounted() {
    this.authRole = localStorage.getItem("auth_role"); // Get value when component is created
    this.fetchConcerns();
  },
};
</script>

<style scoped>
/* Dialog modal customization */
.concern-modal .p-dialog-content {
  font-size: 0.875rem;
}
.assign-dialog .p-dialog-content {
  font-size: 0.875rem;
}
</style>
