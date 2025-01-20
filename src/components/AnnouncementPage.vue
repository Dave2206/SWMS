<template>
  <div class="space-y-8">

    <!-- Create Announcement Form -->
    <div v-if="isLoggedIn" class="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md space-y-4">
      <h2 class="text-xl font-semibold text-gray-800">Create New Announcement</h2>

      <!-- Announcement Form -->
      <form @submit.prevent="submitAnnouncement" class="space-y-4">
        <!-- Subject (Dropdown) -->
        <div>
          <label for="subject" class="block text-sm font-medium text-gray-700 mb-1">Subject</label>
          <select
            id="subject"
            v-model="subject"
            class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
          >
            <option value="" disabled>Select a subject</option>
            <option value="Delay of Garbage Pickup">Delay of Garbage Pickup</option>
            <option value="No Pickup Schedule">No Pickup Schedule</option>
            <option value="Schedule of Pickup">Schedule of Pickup</option>
            <option value="Program">Program</option>
          </select>
        </div>

        <!-- Date and Time -->
        <div>
          <label for="dateTime" class="block text-sm font-medium text-gray-700 mb-1">Date and Time</label>
          <input
            type="datetime-local"
            id="dateTime"
            v-model="dateTime"
            class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
          />
        </div>

        <!-- Route -->
        <div>
          <label for="route" class="block text-sm font-medium text-gray-700 mb-1">Route</label>
          <input
            type="text"
            id="route"
            v-model="route"
            placeholder="Enter the route"
            class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
          />
        </div>

        <!-- Context -->
        <div>
          <label for="context" class="block text-sm font-medium text-gray-700 mb-1">Context</label>
          <textarea
            id="context"
            v-model="context"
            rows="4"
            placeholder="Enter the context of the announcement"
            class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
          />
        </div>

        <!-- Photo Upload -->
        <div>
          <label for="photo" class="block text-sm font-medium text-gray-700 mb-1">Photo</label>
          <FileUpload
            ref="fileupload"
            mode="basic"
            id="photo"
            v-model="photo"
            chooseLabel="Choose a photo"
            accept="image/*"
            class="w-full"
          />
        </div>

        <!-- Submit Button -->
        <div class="flex justify-center">
          <button
            type="submit"
            class="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
          >
            Submit
          </button>
        </div>
      </form>
    </div>

    <!-- Not Logged In Message -->
    <div v-else class="max-w-md mx-auto text-center text-gray-700 text-lg">
      Please <a href="/login" class="text-green-600 hover:underline">log in</a> to create an announcement.
    </div>
  </div>
  
    <!-- Toast Notification -->
    <Toast ref="toast"></Toast>
</template>

<script>
import axios from "axios";
import FileUpload from "primevue/fileupload";

export default {
  name: "AnnouncementPage",
  components: {
    FileUpload,
  },
  data() {
    return {
      subject: "",
      dateTime: null,
      route: "",
      context: "",
      photo: null,
      isLoggedIn: false, // Tracks whether the user is logged in
      userName: "", // Optionally store the user's name
    };
  },
  mounted() {
    // Check if the user is logged in by checking for a token
    const token = localStorage.getItem("auth_token");
    if (token) {
      console.log("test token");
      this.isLoggedIn = true;
      // Optionally, fetch the user's name or details
      this.fetchUserDetails(token);
    }
  },
  methods: {
    async fetchUserDetails(token) {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.userName = response.data.name; // Assume the API returns the user's name
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    },
    async submitAnnouncement() {
      const formData = new FormData();
      formData.append("subject", this.subject);
      formData.append("dateTime", this.dateTime);
      formData.append("route", this.route);
      formData.append("context", this.context);
      if (this.photo && this.photo[0]) {
        formData.append("photo", this.photo[0]);
      }

      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/api/announcements",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
            },
          }
        );
       this.showSuccessToast(response.data.message);
        this.subject = "";
        this.dateTime = null;
        this.route = "";
        this.context = "";
        this.photo = null;
      } catch (error) {
        console.error("Error creating announcement:", error);
        this.showErrorToast(error);
      }
    },
    showSuccessToast(message) {
      this.$refs.toast.add({ severity: 'success', summary: 'Success', detail: message, life: 3000 });
    },
    showErrorToast(message) {
      this.$refs.toast.add({ severity: 'error', summary: 'Error', detail: message, life: 3000 });
    },
  },
};
</script>

<style scoped>
/* Add any custom styles if needed */
</style>
