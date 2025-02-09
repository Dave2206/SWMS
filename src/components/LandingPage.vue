<template>
  <div class="flex flex-col min-h-screen">
    <!-- Banner -->
    <div
      class="w-full bg-cover bg-center flex items-center justify-center text-center text-white relative"
      style="background-image: url('/assets/swms_banner_dark.png'); height: 60vh;"
    >
    </div>

    <!-- Services Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-6 sm:px-8 lg:px-12 py-8">
      <!-- Card 1: Submit Complaints -->
      <p-card class="service-card bg-red-600">
        <template #title>
          <h3 class="text-xl font-semibold text-gray">Submit Concerns</h3>
        </template>
        <template #content>
          <p class="text-gray">Easily submit waste management complaints.</p>
        </template>
        <template #footer>
          <Button
            label="Submit Complaint"
            icon="pi pi-file"
            class="w-full p-button-success p-button-text"
            @click="goToComplainPage"
          />
        </template>
      </p-card>

      <!-- Card 2: Announcements -->
      <p-card class="service-card bg-green-600">
        <template #title>
          <h3 class="text-xl font-semibold text-gray">Announcements</h3>
        </template>
        <template #content>
          <p class="text-gray">Stay updated with the latest announcements and notifications.</p>
        </template>
        <template #footer>
          <Button
            label="View Announcements"
            icon="pi pi-megaphone"
            class="w-full p-button-info p-button-text"
            @click="goToAnnouncementPage"
          />
        </template>
      </p-card>

      <!-- Card 3: Analytics -->
      <p-card class="service-card bg-blue-600">
        <template #title>
          <h3 class="text-xl font-semibold text-gray">Analytics</h3>
        </template>
        <template #content>
          <div class="flex flex-row gap-4">
            <!-- Total Submitted Concerns -->
            <p-card class="flex-1 bg-white text-center">
              <template #title>
                <h4 class="text-sm font-semibold text-blue-600">Total No. Concerns</h4>
              </template>
              <template #content>
                <p class="text-xl font-bold text-gray-800">{{ analytics.totalConcerns }}</p>
              </template>
            </p-card>
            <!-- Total Resolved Concerns -->
            <p-card class="flex-1 bg-white text-center">
              <template #title>
                <h4 class="text-sm font-semibold text-green-600">No. Resolved Concerns</h4>
              </template>
              <template #content>
                <p class="text-xl font-bold text-gray-800">{{ analytics.resolvedConcerns }}</p>
              </template>
            </p-card>
          </div>
        </template>
      </p-card>
    </div>
  </div>
</template>

<script>
import Card from "primevue/card";
import axios from "axios";

export default {
  name: "LandingPage",
  components: { "p-card": Card },
  data() {
    return {
      analytics: {
        totalConcerns: 0,
        resolvedConcerns: 0,
      },
    };
  },
  created() {
    this.checkIfLoggedIn();
    this.fetchAnalytics();
  },
  methods: {
    checkIfLoggedIn() {
      const token = localStorage.getItem("auth_token");
      if (token) {
        this.$router.push({ name: "DashboardPage" });
      }
    },
    async fetchAnalytics() {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/analytics");
        this.analytics.totalConcerns = response.data.total_concerns;
        this.analytics.resolvedConcerns = response.data.resolved_concerns;
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      }
    },
    goToComplainPage() {
      this.$router.push({ name: "ComplainPage" });
    },
    goToAnnouncementPage() {
      this.$router.push({ name: "DashboardPage" });
    },
  },
};
</script>



<style scoped>
/* Banner Section */
.bg-gradient-to-r {
  background: linear-gradient(to right, #5fbde9bd, #85f0a1); /* Green gradient */
}

/* Text Shadow for Heading */
.text-shadow-lg {
  text-shadow: 3px 3px 12px rgba(0, 0, 0, 0.7);
}

/* Apply Poppins font to entire page */
body {
  font-family: 'Poppins', sans-serif;
}

/* Banner Text Styling */
h1, p {
  font-family: 'Poppins', sans-serif;
}

/* Cards Styling */
.service-card {
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 24px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.service-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

/* Button Styling */
.p-button-success {
  background-color: #38A169; /* Green Button */
  border: none;
  color: white;
}

.p-button-info {
  background-color: #2B6A4B; /* Darker Green Button */
  border: none;
  color: white;
}

.p-button-warning {
  background-color: #3182CE; /* Blue Button */
  border: none;
  color: white;
}

/* Button Hover Effects */
.p-button-success:hover, .p-button-info:hover, .p-button-warning:hover {
  opacity: 0.9;
}

/* Grid Layout */
.grid {
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  justify-items: center;
}

/* Footer Styling */
footer {
  font-size: 1rem;
  text-align: center;
  color: #E2E8F0;
}

/* General Margin and Padding */
section {
  padding: 40px 0;
}
</style>
