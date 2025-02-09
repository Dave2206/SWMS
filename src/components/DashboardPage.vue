<template>
  <div class="dashboard">
    <!-- Conditional rendering based on login status -->
    <template v-if="isLoggedIn && authRole != 'Driver'">
      <h1>Welcome, {{ username }}!</h1>

      <div class="dashboard-actions">
        <Button 
          label="Create Announcement" 
          icon="pi pi-plus" 
          class="p-button-success" 
          @click="navigateToCreateAnnouncement" 
        />
      </div>
    </template>
        <!-- Not Logged In Message -->
  <template v-else>
  <div class="announcement-placeholder">
    <h1 class="text-2xl font-bold text-gray-800">Announcements</h1>
  </div>
</template>
      <div v-if="loading" class="loading">Loading announcements...</div>

      <div v-else-if="announcements.length === 0" class="no-announcements">
        <p>No announcements available. Be the first to create one!</p>
      </div>

      <div v-else class="announcement-feed">
        <ul>
          <li v-for="announcement in announcements" :key="announcement.id" class="announcement-card">
            <div class="announcement-header">
              <div class="avatar" :style="{ backgroundColor: getAvatarBackgroundColor(announcement.author) }">
                <span>{{ getInitials(announcement.author) }}</span>
              </div>
              <div class="announcement-meta">
                <h3>{{ announcement.subject }}</h3>
                <small>{{ formatDate(announcement.created_at) }}</small>
              </div>
            </div>

            <p class="announcement-body">{{ announcement.body }}</p>

            <div v-if="announcement.image_path" class="announcement-image">
              <img 
                :src="`http://127.0.0.1:8000/storage/${announcement.image_path}`" 
                alt="Announcement Image" 
                class="resized-image"
              />
            </div>

            <div class="announcement-footer">
              <small>Effective Date: {{ formatDate(announcement.effective_date) }}</small>
              <br />
              <small>Posted by: {{ announcement.author || "Unknown" }}</small>
            </div>
          </li>
        </ul>
      </div>
  </div>
</template>


<script>
import axios from "axios";
import { format } from "date-fns";

export default {
  data() {
    return {
      username: "", // Logged-in user's username
      announcements: [], // List of announcements
      loading: true, // Loading state
      isLoggedIn: false, // Check if the user is logged in
      authRole: null, // Store the role from localStorage
    };
  },
  created() {
    this.checkAuthentication(); // Check login status
    this.authRole = localStorage.getItem("auth_role"); // Get value when component is created
    this.fetchAnnouncements(); // Fetch announcements
  },
  methods: {
    checkAuthentication() {
      const token = localStorage.getItem("auth_token");
      if (token) {
        this.isLoggedIn = true;
        this.fetchUserData();
      }
    },
    async fetchUserData() {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/user/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        });
        this.username = response.data.username || "User"; // Fallback if no username is provided
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    },
    async fetchAnnouncements() {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/announcements", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        });
        this.announcements = response.data.data || []; // Handle API response
      } catch (error) {
        console.error("Error fetching announcements:", error);
      } finally {
        this.loading = false; // End loading state
      }
    },
    formatDate(date) {
      return format(new Date(date), "MMMM d, yyyy h:mm a"); // Format the date
    },
    navigateToCreateAnnouncement() {
      this.$router.push({ name: "AnnouncementPage" }); // Navigate to the create announcement page
    },
    getInitials(name) {
      if (!name) return ""; // Check if the name is available
      const nameParts = name.split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts[1] || "";
      return (firstName[0] || "") + (lastName[0] || ""); // Return initials
    },
    getAvatarBackgroundColor(name) {
      if (!name) return "#007bff"; // Default color if no name is provided
      const colors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A6", "#FFC300", "#FF6347", "#32CD32"];
      const index = name.charCodeAt(0) % colors.length; // Pick color based on first character of name
      return colors[index];
    },
  },
};
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

h1 {
  font-size: 2rem;
  margin-bottom: 20px;
}

.dashboard-actions {
  margin-bottom: 20px;
}

.loading,
.no-announcements {
  text-align: center;
  font-size: 1.2rem;
  color: #777;
}

.announcement-feed {
  margin-top: 20px;
}

.announcement-card {
  padding: 20px;
  background: #fff;
  border-radius: 10px;
  border: 1px solid #ddd;
  margin-bottom: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.announcement-card:hover {
  transform: scale(1.02);
}

.announcement-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem;
  color: white;
  margin-right: 15px;
  background-color: #007bff; /* Default background color */
}

.announcement-meta {
  flex: 1;
}

.announcement-meta h3 {
  font-size: 1.2rem;
  margin: 0;
  font-weight: bold;
}

.announcement-meta small {
  font-size: 0.9rem;
  color: #666;
}

.announcement-body {
  font-size: 1.1rem;
  color: #333;
  margin: 15px 0;
}

.announcement-image img {
  width: 100%;
  max-height: 300px;
  object-fit: cover;
  border-radius: 10px;
  margin-top: 15px;
}

.announcement-footer {
  font-size: 0.9rem;
  color: #777;
  margin-top: 15px;
}

.resized-image {
  max-width: 100%;
  max-height: 400px;
  object-fit: contain;
}

button {
  cursor: pointer;
  padding: 8px 20px;
  background-color: #007bff;
  border: none;
  color: white;
  font-size: 1rem;
  border-radius: 5px;
}

</style>
